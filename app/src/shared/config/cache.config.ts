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

export type CacheKeysAndTtl = {
    key: string
    ttlSecs: number
}

export type CacheKeys = {
    userById: (userId: string) => string
    walletByUserId: (UserId: string) => string
}

export type CacheTtls = {
    userTtlSecs: number
    walletTtlSecs: number
}

export const cacheKeys: CacheKeys = {
    userById: (userId: string) => "user:" + userId,
    walletByUserId: (userId: string) => 'walletOfUser:' + userId
}

export const cacheTtls = {
    userTtlSecs: 60 * 10,
    walletTtlSecs: 60 * 15
}

