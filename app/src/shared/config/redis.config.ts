import "dotenv/config"
import type { RedisOptions } from "ioredis";

export const redisOptions: RedisOptions = {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT) ?? 6379,
    username: process.env.REDIS_USERNAME ?? 'default',
    password: process.env.REDIS_PASSWORD,
    db: 0,
    offlineQueue: false,
    maxRetriesPerRequest: 2,
    maxLoadingRetryTime: 2,
    lazyConnect: true,
}   
