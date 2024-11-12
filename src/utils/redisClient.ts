import { createClient } from "redis";
import dotenv from "dotenv"

dotenv.config()

// const redisClient = createClient({url: "redis://127.0.0.1:6379"}) // "redis://name(:)pass@redis-url"

const redisClient = createClient({url: process.env.REDIS_URL})

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);   
})

redisClient.connect()

export default redisClient
