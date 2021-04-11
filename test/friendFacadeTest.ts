import * as mongo from "mongodb"
import FriendFacade from '../src/facades/friendFacade';

import chai from "chai";
const expect = chai.expect;

//use these two lines for more streamlined tests of promise operations
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import bcryptjs from "bcryptjs"
import { InMemoryDbConnector } from "../src/config/dbConnector"
import { ApiError } from "../src/errors/errors";
import FriendsFacade from "../src/facades/friendFacade";

let friendCollection: mongo.Collection;
let facade: FriendFacade;

describe("## Verify the Friends Facade ##", () => {

  before(async function () {
    //Connect to inmemory test database
    //Get the database and initialize the facade
    //Initialize friendCollection, to operate on the database without the facade
    const client = await InMemoryDbConnector.connect();
    const db = client.db();
    friendCollection = db.collection("friends")
    facade = new FriendsFacade(db)
  })

  beforeEach(async () => {
    const hashedPW = await bcryptjs.hash("secret", 4)
    await friendCollection.deleteMany({})
    await friendCollection.insertMany([
      {firstName: "Torsten", lastName: "Træben", email: "tt@mail.com", password: hashedPW, role: "user"},
      {firstName: "Mogens", lastName: "Madsen", email: "mm@mail.com", password: hashedPW, role: "user"}
    ])
  })

  describe("Verify the addFriend method", () => {
    it("It should Add the user Jan", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret" }
      const status = await facade.addFriend(newFriend);
      expect(status).to.be.not.null
      const jan = await friendCollection.findOne({ email: "jan@b.dk" })
      expect(jan.firstName).to.be.equal("Jan")
    })

    it("It should not add a user with a role (validation fails)", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret", role: "admin" }
      await expect(facade.addFriend(newFriend)).to.be.rejectedWith(ApiError)
    })
  })

  describe("Verify the editFriend method", () => {
    it("It should change lastName to XXXX", async () => {
      const newLastName = {firstName: "Torsten", lastName: "Trold", email: "tt@mail.com", password: "secret"}
      const status = await facade.editFriend("tt@mail.com", newLastName)
      expect(status.modifiedCount).to.equal(1)
      const editetFriend = await friendCollection.findOne({email: "tt@mail.com"})
      expect(editetFriend.lastName).to.be.equal("Trold")
    })
  })

  describe("Verify the deleteFriend method", () => {
    it("It should remove the user Peter", async () => {
      const torsten = await facade.deleteFriend("tt@mail.com")
      const status = await friendCollection.findOne({email: "tt@mail.com"})
      expect(status).to.be.null
    })

    it("It should return false, for a user that does not exist", async () => {
      const deletedUser = await facade.deleteFriend("qq@mail.com")
      expect(deletedUser).to.be.false
    })
  })

  describe("Verify the getAllFriends method", () => {
    it("It should get two friends", async () => {
      const friends = await facade.getAllFriends()
      expect(friends.length).to.be.equal(2)
    })
  })

  describe("Verify the getFriend method", () => {
    it("It should find Mogens", async () => {
      const friend = await facade.getFrind("mm@mail.com")
      expect(friend.firstName).to.be.equal("Mogens")
    })
    it("It should not find xxx.@.b.dk", async () => {
      const fakeFriend = await facade.getFrind("xxx.@.b.dk")
      expect(fakeFriend).to.be.null
    })
  })

  describe("Verify the getVerifiedUser method", () => {
    it("It should correctly validate Torsten Træben's credentials", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("tt@mail.com", "secret")
      expect(veriefiedPeter).to.be.not.null;
    })

    it("It should NOT validate Peter Pan's credentials", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("tt@mail.com", "ikke")
      expect(veriefiedPeter).to.be.null;
    })

    it("It should NOT validate a non-existing users credentials", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("bb@mail.com", "secret")
      expect(veriefiedPeter).to.be.null;
    })
  })

})
