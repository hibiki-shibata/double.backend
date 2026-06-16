import pino, { type DestinationStream, type LoggerOptions } from "pino"
import { isDevMode } from "./env.config.js"

export const loggerOptions: LoggerOptions = {
    level: process.env.LOG_LEVEL ?? "info",
    formatters: {
        level(label) {
            return { level: label }
        },
    },
    base: {
        service: "double-backend",
        isDevMode: isDevMode
    },
    redact: ['password_hash', 'password'],
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
