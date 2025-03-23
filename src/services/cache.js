import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

// temp
const CACHE_EXPIRY = 60 * 5;

const CacheService = {
  async getUserById(userId) {
    const cacheKey = `user:${userId}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      logger.info(`Cache hit for ${cacheKey}`);
      return JSON.parse(cachedUser);
    }

    logger.info(`Cache miss for ${cacheKey}`);
    return null;
  },

  async setUser(userId, userData) {
    console.log(userData);

    const cacheKey = `user:${userId}`;
    await redisClient.set(
      cacheKey,
      JSON.stringify(userData),
      "EX",
      CACHE_EXPIRY
    );
    logger.info(`Cache set for ${cacheKey}`);
  },

  async getUserByEmail(email) {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      logger.info(`Cache hit for ${cacheKey}`);
      return JSON.parse(cachedUser);
    }

    logger.info(`Cache miss for ${cacheKey}`);
    return null;
  },

  async clearUserCache(userId) {
    const cacheKey = `user:${userId}`;
    await redisClient.del(cacheKey);
    logger.info(`Cache cleared for ${cacheKey}`);
  },
};

export default CacheService;
