import Redis from "ioredis";
import { logger } from "../utils/logger";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = new Redis(redisUrl);

redisClient.on("error", (error) => {
  logger.error(`Redis Error: ${error.message}`);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

export { redisClient };
