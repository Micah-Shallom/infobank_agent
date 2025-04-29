import mongoose from "mongoose";
import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

export async function connectDB(): Promise<MongoClient> {
  const client = new MongoClient(MONGO_URI || "mongodb://localhost:27017");
  await client.connect();
  return client;
}
