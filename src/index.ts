// Entry point
import { server, port } from './server.js'
import { logger } from './shared/logger/logger.js'

const serverInstance = server.listen(port, () =>
    logger.info({ port }, 'Double backend started')
)

async function gracefulShutdown(signal: string) {
    logger.warn({ signal }, 'shutdown signal received')

    serverInstance.close(async () => {
        await new Promise<void>((resolved) => logger.flush(() => resolved()))
        process.exit(0)
    })

    setTimeout(() => {
        logger.error('Forced exit for timeout')
        process.exit(1)
    }, 10000).unref()
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))