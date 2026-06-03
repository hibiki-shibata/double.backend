// Entry point
import { server, port } from './server.js'
import { logger } from './shared/logger/logger.js'

server.listen(port, () => {
    logger.info(`Double Backend Server is listeing on ${port}`)
})