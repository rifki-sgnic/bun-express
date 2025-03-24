import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { MONGO_URI } from "./config";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
}
