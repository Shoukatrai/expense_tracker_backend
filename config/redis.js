import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

export const redisConnect = async () => {
  try {
    redisClient.on("error", (err) =>
      console.error("Redis error:", err)
    );

    await redisClient.connect();
    console.log("Connected to Redis.");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

export default redisClient;
