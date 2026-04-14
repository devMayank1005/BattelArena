import { Redis } from "ioredis";
import env from "./config.js";
const redis = new Redis({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PASSWORD,
});
redis.on("connect", () => {
    console.log("Redis connected successfully 💾");
});
redis.on("error", (error) => {
    console.error("Error connecting to Redis:", error);
});
export default redis;
