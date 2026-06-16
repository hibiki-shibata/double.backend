import pino, { type Logger } from 'pino'
import { destinationStreamOptions, loggerOptions } from '../config/logger.config.js'

export const logger: Logger = pino(
    loggerOptions,
    destinationStreamOptions
)