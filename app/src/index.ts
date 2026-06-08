// Entry point
import "dotenv/config"
import { server, port } from './server.js'
import { logger } from './shared/logger/logger.js'
import { prisma } from "./shared/infra/db/postgresClient.js"

const serverInstance = server.listen(port, () =>
    logger.info({ port }, 'Double backend started')
)

function gracefulShutdown(
    signal: string
): void {
    logger.warn({ signal }, 'Shutdown signal received')

    serverInstance.close(async () => {
        await prisma.$disconnect()
        logger.info('Postgres prisma client disconnected')
        await new Promise<void>((resolved) => logger.flush(() => resolved()))
        process.exit(0)
    })

    setTimeout(() => {
        logger.error('Timeout: Forced process exit')
        process.exit(1)
    }, 30000).unref()
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))