// https://redis.io/docs/latest/develop/clients/ioredis/
import type { Logger } from "pino"
import type { CacheService } from "./cache.service.js"
import type { Redis } from "ioredis"

export class RedisCacheService implements CacheService {
    constructor(
        private readonly redisClient: Redis,
        private readonly logger: Logger,
        private readonly defaultTtlSecs: number = 60 * 5
    ) { }

    async getByKey<T>(
        key: string
    ): Promise<T | null> {
        try {
            const value: string | null = await this.redisClient.get(key)
            if (value === null) return null
            return JSON.parse(value)
        } catch (err) {
            this.logger.error({ err, key }, 'Redis: cache get failed')
            return null
        }
    }

    async setByKey<T>(
        key: string,
        value: T,
        ttlSeconds: number = this.defaultTtlSecs
    ): Promise<void> {
        try {
            await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds)
        } catch (err) {
            this.logger.error({ err, key }, 'Redis: cache set failed')
        }
    }

    async deleteByKey(
        key: string
    ): Promise<void> {
        try {
            await this.redisClient.del(key)
        } catch (err) {
            this.logger.error({ err, key }, 'Redis: cache delete failed')
        }
    }
}