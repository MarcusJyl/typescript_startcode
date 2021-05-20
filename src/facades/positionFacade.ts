import path from "path"
require('dotenv').config({ path: path.join(__dirname, "..", "..", '.env') })
import { Db, Collection, ObjectID } from "mongodb";
import IPosition from '../interfaces/IPositions'
import FriendsFacade from './friendFacade';
import { DbConnector } from "../config/dbConnector"
import { ApiError } from "../errors/errors";
import { options } from "joi";

class PositionFacade {
  db: Db
  positionCollection: Collection
  friendFacade: FriendsFacade;

  constructor(db: Db) {
    this.db = db;
    this.positionCollection = db.collection("positions");
    this.friendFacade = new FriendsFacade(db);
  }

  async addOrUpdatePosition(email: string, longitude: number, latitude: number): Promise<IPosition> {
    const friend = await this.friendFacade.getFriendFromEmail(email)
    const fullName = friend.firstName + " " + friend.lastName
    const query = {email}
    const pos:IPosition = {lastUpdated: new Date(), email:email, name:fullName, location: {type: "Point", coordinates: [longitude,latitude]}}
    const update = {
        $set: {...pos}
    }
    const options = {upsert:true, returnOriginal: false} //Upsert betyder lav hvis ikke findes
    const result = await this.positionCollection.findOneAndUpdate(query,update, options)
    return result.value
  }

  async findNearbyFriends(email: string, password: string, longitude: number, latitude: number, distance: number): Promise<Array<IPosition>> {
    const friend = await this.friendFacade.getFriendFromEmail(email)
    await this.addOrUpdatePosition(email, longitude,latitude)
    return this.positionCollection.find({
        email:{$ne: email},
        location: {
        
          $near: {
            $geometry: {
               type: "Point" ,
               coordinates: [ longitude , latitude ]
            },
            $maxDistance: distance,
            
          }
        }
     }).toArray()
  }

  async getAllPositions(): Promise<Array<IPosition>> {
    return this.positionCollection.find({}).toArray();
  }


}

export default PositionFacade;

async function tester() {
  const client = await DbConnector.connect()
  const db = client.db(process.env.DB_NAME)
  const positionFacade = new PositionFacade(db)
  await positionFacade.addOrUpdatePosition("pp@b.dk", 5, 5)
  process.exit(0)
}

//tester()