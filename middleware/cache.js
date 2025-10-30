import redisClient from "../config/redis.js";

export const cache = async (req, res, next) => {
  try {
    const key = req.originalUrl;
    console.log("key", key);
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.status(200).json({
        data: JSON.parse(cachedData),
        message: "Data fetch from cache",
        status: true,
      });
    }

    next();
  } catch (error) {
    console.error("Redis error:", error);
    next(); 
  }
};
