// https://ioredis.com/
import { Redis } from "ioredis"
import { redisOptions } from "../../config/redis.config.js"
import { logger } from "../../logger/logger.js"

export const redis: Redis = new Redis(redisOptions)

redis.on('error', (error) => {
    logger.error({error}, 'Redis error')
})


