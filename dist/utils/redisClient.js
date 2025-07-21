"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.REDIS_URL;
// const redisClient = createClient({url: "redis://127.0.0.1:6379"}) // "redis://name(:)pass@redis-url"
const redisClient = (0, redis_1.createClient)({ url: url });
redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});
redisClient.connect();
exports.default = redisClient;
