import express from 'express'
import { type Express } from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { rateLimitConfig } from './shared/config/rateLimit.config.js'
import helmet from 'helmet'
import { corsConfig } from './shared/config/cors.config.js'
import { addTraceHeader } from './shared/middleware/addTraceHeader.js'
import { featuresRouter } from "./features/features.router.js"
import { globalExceptionHandler } from "./shared/middleware/globalExceptionHandler.js"

export const port: string = process.env.PORT_NUMBER ?? "5000"
export const server: Express = express()

server.use(rateLimit(rateLimitConfig))
server.use(cors(corsConfig))
server.use(helmet())
server.use(addTraceHeader)
server.use(express.json())
server.use('/api', featuresRouter)
server.use(globalExceptionHandler)