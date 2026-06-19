import pino, { type Logger } from 'pino'
import { destinationStreamOptions, loggerOptions } from '@global-shared/config/logger.config.js'

export const logger: Logger = pino(
    loggerOptions,
    destinationStreamOptions
)