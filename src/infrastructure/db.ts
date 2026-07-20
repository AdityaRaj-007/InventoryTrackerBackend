import mongoose from "mongoose";
import { env } from "../shared/config/env";

const MONGO_URI = env.mongoUri;

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to mongodb");
  } catch (err) {
    console.log(err);
  }
};
