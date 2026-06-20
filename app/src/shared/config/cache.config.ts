import type { RedisOptions } from "ioredis";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

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

export type CacheKeys = {
    user: {
        byId: (userId: string) => string
    }
    wallet: {
        byUserId: (userId: string) => string
    }
    walletHistory: {
        byWalletIdAndPagination: (userId: string, pagenation: PaginationDBInput) => string
    }
}

export const cacheKeys: CacheKeys = {
    user: {
        byId: (userId: string) => `user:${userId}`
    },
    wallet: {
        byUserId: (walletId: string) => `wallet:${walletId}`
    },
    walletHistory: {
        byWalletIdAndPagination: (userId: string, pagenation: PaginationDBInput) => `walletHistory:${userId}:${pagenation}`
    }
}


export type CacheTtlsSec = {
    user: number,
    wallet: number,
    walletHistory: number
}

export const cacheTtlsSec: CacheTtlsSec = {
    user: 60 * 15, // Secs
    wallet: 30,
    walletHistory: 60 * 10
}

