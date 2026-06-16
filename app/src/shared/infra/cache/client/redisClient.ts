// https://ioredis.com/
import { Redis } from "ioredis"
import { logger } from "../../../logger/logger.js"
import { redisOptions } from "../../../config/cache.config.js"

export const redisClient: Redis = new Redis(redisOptions)

redisClient.on('error', (error) => {
    logger.error({error}, 'Redis error')
})


