import "dotenv/config";

export const APP_ENV = process.env.APP_ENV || "development";
export const APP_URL = process.env.APP_URL || "http://localhost:3001";
export const PORT = process.env.PORT || 3001;

export const LOG_DIR = process.env.LOG_DIR || "../logs";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/your_db";
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "YOUR_JWT_ACCESS_SECRET";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "YOUR_JWT_REFRESH_SECRET";

export const SHORT_EXPIRES = process.env.SHORT_EXPIRES || "1h";
export const LONG_EXPIRES = process.env.LONG_EXPIRES || "1d";
export const VERY_LONG_EXPIRES = process.env.VERY_LONG_EXPIRES || "7d";
