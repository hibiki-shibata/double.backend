// https://redis.io/docs/latest/develop/clients/ioredis/
import type { Redis } from "ioredis"
import type { Logger } from "express-rate-limit"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js"
import type { CacheService, CacheServiceParams } from "./cache.service.js"
import { InvalidInputErr } from "@global-shared/error/httpErrors.js"

export class RedisCacheService implements CacheService {
    constructor(
        private readonly redisClient: Redis,
        private readonly loggerContext: LoggerContext,
        // private readonly defaultTtlSecs: number = 60 * 5
    ) { }

    async getByKey<T = object>(
        key: string,
    ): Promise<T | null> {
        try {
            const value: string | null = await this.redisClient.get(key)
            if (value === null) return null
            return JSON.parse(value)
        } catch (err) {
            const logger: Logger = this.loggerContext.getLogger()
            logger.error({ err, key }, 'Redis: cache get failed')
            return null
        }
    }

    async set<T = object>(
        dto: CacheServiceParams.Set<T>
    ): Promise<void> {
        try {
            if (typeof dto.value !== 'object') throw new InvalidInputErr('cache data must be a object type')
            await this.redisClient.set(dto.key, JSON.stringify(dto.value), 'EX', dto.ttlSec)
        } catch (err) {
            const logger: Logger = this.loggerContext.getLogger()
            logger.error({ err, key: dto.key }, 'Redis: cache set failed')
        }
    }

    async deleteByKey(
        key: string
    ): Promise<void> {
        try {
            await this.redisClient.del(key)
        } catch (err) {
            const logger: Logger = this.loggerContext.getLogger()
            logger.error({ err, key }, 'Redis: cache delete failed')
        }
    }
}