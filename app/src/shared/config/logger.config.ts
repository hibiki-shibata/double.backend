import pino, { type DestinationStream, type LoggerOptions } from "pino"
import { env, isDevMode } from "./env.js"

export const loggerOptions: LoggerOptions = {
    level: env.LOG_LEVEL,
    formatters: {
        level(label) {
            return { level: label }
        },
    },
    base: {
        service: "double-backend",
        isDevMode: isDevMode,
        env: env.APP_ENV,
    },
    redact: ['password_hash', 'password', 'req.headers.authorization'],
    timestamp: pino.stdTimeFunctions.isoTime,
}

export const destinationStreamOptions: DestinationStream
    = isDevMode ?
        pino.transport({
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'pid,hostname,service',
                translateTime: 'SYS:HH:MM:ss',
            },
        })
        : pino.destination({
            sync: false
        })