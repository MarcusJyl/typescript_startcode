import express from "express";
import dotenv from "dotenv";
import path from "path"
dotenv.config()
import { ApiError } from "./errors/errors"

//TODO: Decide for which one to use below
import friendsRoutes from "./routes/friendRoutesAuth";
//import friendsRoutes from "./routes/friendRoutes";
const debug = require("debug")("app")
import { Request, Response, NextFunction } from "express"
import cors from "cors"

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  debug(new Date().toLocaleDateString(), req.method, req.originalUrl, req.ip)
  next()
})

app.use(cors())

app.use(express.static(path.join(process.cwd(), "public")))

app.use("/api/friends", friendsRoutes)

app.get("/demo", (req, res) => {
  res.send("Server is up");
})

import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schemas';

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));



//Our own default 404-handler for api-requests
app.use("/api", (req: any, res: any, next) => {
  res.status(404).json({ errorCode: 404, msg: "not found" })
})

//Makes JSON error-response for ApiErrors, otherwise pass on to default error handleer
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof (ApiError)) {
     res.status(err.errorCode).json({ errorCode: err.errorCode, msg: err.message })
  } else {
    next(err)
  }
})

export default app;

