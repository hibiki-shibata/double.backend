import pino from 'pino'
import { destinationStreamOptions, loggerOptions } from '../config/logger.config.js'

export const logger = pino(
    loggerOptions,
    destinationStreamOptions
)