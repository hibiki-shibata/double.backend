import pino, { type Logger } from 'pino'
import { destinationStreamOptions, loggerOptions } from '@global-shared/config/logger.config.js'
import { LoggerContextV1 } from './loggerContext.v1.js'
import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage<Logger>

const baseLogger: Logger = pino(
    loggerOptions,
    destinationStreamOptions
)

export const loggerContext = new LoggerContextV1(baseLogger, asyncLocalStorage)