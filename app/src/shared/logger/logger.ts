import pino from 'pino'
import { destinationStreamConfig, loggerConfig } from '../config/logger.config.js'

export const logger = pino(
    loggerConfig,
    destinationStreamConfig
)