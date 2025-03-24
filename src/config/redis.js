import Redis from "ioredis";
import { logger } from "../utils/logger";
import { REDIS_URL } from "./config";

const redisClient = new Redis(REDIS_URL);

redisClient.on("error", (error) => {
  logger.error(`Redis Error: ${error.message}`);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

export { redisClient };
