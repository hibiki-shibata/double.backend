import pino, { type Logger } from 'pino'
import { destinationStreamOptions, loggerOptions } from '@global-shared/config/logger.config.js'
import { AsyncLocalStorage } from 'node:async_hooks'

export const contextLoggerStorage = new AsyncLocalStorage<Logger>() //To pass request IDs

export const baseLogger: Logger = pino(
    loggerOptions,
    destinationStreamOptions
)

