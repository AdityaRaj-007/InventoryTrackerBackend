import mongoose from "mongoose";
import { moveMessagePortToContext } from "node:worker_threads";

const MONGO_URI = process.env.MONOGO_URI;

if (!MONGO_URI) {
  throw Error("MongoDb URL is not mentioned");
}

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to mongodb");
  } catch (err) {
    console.log(err);
  }
};
