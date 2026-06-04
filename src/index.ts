// Entry point
import "dotenv/config"
import { server, port } from './server.js'
import { logger } from './shared/logger/logger.js'

const serverInstance = server.listen(port, () =>
    logger.info({ port }, 'Double backend started')
)

async function gracefulShutdown(signal: string) {
    logger.warn({ signal }, 'Shutdown signal received')

    serverInstance.close(async () => {
        await new Promise<void>((resolved) => logger.flush(() => resolved()))
        process.exit(0)
    })

    setTimeout(() => {
        logger.error('Forced timeout process exit')
        process.exit(1)
    }, 30000).unref()
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))