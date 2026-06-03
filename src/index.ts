// Entry point
import { server, port } from './server.js'
import { logger } from './shared/logger/logger.js'

const activeServer = server.listen(port, () => {
    logger.info({ port }, 'Double backend started')
})

async function shutdown(signal: string) {
    logger.warn({ signal }, 'shutdown received')
    
    activeServer.close(async () => {
        // await db.end();
        await new Promise<void>((resolved) => logger.flush(() => resolved()))
        process.exit(0)
    })

    setTimeout(() => {
        logger.error('Forced shutdown - Graceful shutdown failed')
        process.exit(1)
    }, 10000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))