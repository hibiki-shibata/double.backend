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
        byDto: (getManyDto: string) => string
    }
    market: {
        byId: (marketId: string) => string
    }
    marketList: {
        byPagination: (pagination: PaginationDBInput) => string
    }
    bet: {
        byId: (betId: string) => string
    },
    betHistory: {
        byDto: (getManyDto: string) => string
    }
}

export const cacheKeys: CacheKeys = {
    user: {
        byId: (userId: string) => `user:${userId}`
    },
    wallet: {
        byUserId: (userId: string) => `wallet:${userId}`
    },
    walletHistory: {
        byDto: (getManyDto: string) => `walletHistory:${getManyDto}`
    },
    market: {
        byId: (marketId: string) => `market:${marketId}`
    },
    marketList: {
        byPagination: (pagination: PaginationDBInput) => `availableMarkets:${pagination}`
    },
    bet: {
        byId: (betId: string) => `bet:${betId}`
    },
    betHistory: {
        byDto: (getManyDto: string) => `betHistory:${getManyDto}`
    }
}


export type CacheTtlsSec = {
    user: number
    wallet: number
    walletHistory: number
    market: number
    marketList: number
    bet: number
    betHistory: number
}

export const cacheTtlsSec: CacheTtlsSec = {
    user: 60 * 15, // Secs
    wallet: 30,
    walletHistory: 60 * 10,
    market: 60 * 5,
    marketList: 60 * 10,
    bet: 60 * 10,
    betHistory: 60 * 10
}

