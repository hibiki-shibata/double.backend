// https://ioredis.com/
import { Redis } from "ioredis"
import { logger } from "@global-shared/logger/logger.js"
import { redisOptions } from "@global-shared/config/cache.config.js"

export const redisClient: Redis = new Redis(redisOptions)

redisClient.on('error', (error) => {
    logger.error({error}, 'Redis error')
})


