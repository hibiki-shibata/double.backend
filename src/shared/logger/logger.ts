import pino from 'pino'

const isDevMode = process.env.NODE_ENV === 'dev'

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    formatters: {
        level(label) {
            return { level: label }
        },
    },
    base: { service: "double-backend", env: process.env.NODE_ENV },
    redact: ['*password*'],
    timestamp: pino.stdTimeFunctions.isoTime
},
    isDevMode ?
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
)