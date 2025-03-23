import { redisClient } from "../config/redis";

const CacheRepository = {
  async getCache(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  },

  async setCache(key, value, ttl = 3600) {
    try {
      await redisClient.set(key, JSON.stringify(value), "EX", ttl);
    } catch (error) {
      console.error("Failed to set cache:", error);
    }
  },

  async deleteCache(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Failed to delete cache:", error);
    }
  },
};

export default CacheRepository;
