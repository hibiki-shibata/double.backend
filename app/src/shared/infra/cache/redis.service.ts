// https://redis.io/docs/latest/develop/clients/ioredis/
import { logger } from "../../logger/logger.js"
import { redis } from "./redisClient.js"

export type CacheService = {
    getByKey(key: string): Promise<unknown | null>
    setByKey(key: string, value: unknown, ttlSeconds?: number): Promise<void>
    deleteByKey(key: string): Promise<void>
}

export class RedisCacheService implements CacheService {
    private readonly defaultTtlSeconds: number = 60 * 5

    async getByKey(
        key: string
    ): Promise<unknown | null> {
        try {
            const value: string | null = await redis.get(key)
            if (value !== null) {
                return JSON.parse(value)
            }
            return value
        } catch (err) {
            logger.error({ err, key }, 'Redis: cache get failed')
            return null
        }
    }

    async setByKey(
        key: string,
        value: unknown,
        ttlSeconds: number = this.defaultTtlSeconds
    ): Promise<void> {
        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
        } catch (err) {
            logger.error({ err, key }, 'Redis: cache set failed')
        }
    }

    async deleteByKey(
        key: string
    ): Promise<void> {
        try {
            await redis.del(key)
        } catch (err) {
            logger.error({ err, key }, 'Redis: cache delete failed')
        }
    }
}