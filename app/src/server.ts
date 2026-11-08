import express, { type Express } from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { rateLimitOptions, corsOptions } from './shared/config/security.config.js'
import helmet from 'helmet'
import { addTraceHeader } from './shared/middleware/addTraceHeader.js'
import { ENDPOINT_PATH_PREFIX } from '@global-shared/config/env.config.js'
import { featuresRouter } from "./features/features.router.js"
import { globalErrorHandler } from "./shared/middleware/globalErrorHandler.js"
import cookieParser from 'cookie-parser'

export const port: string = process.env.PORT_NUMBER ?? "5000"
export const server: Express = express()

server.use(rateLimit(rateLimitOptions))
server.use(cors(corsOptions))
server.use(express.json())
server.use(helmet())
server.use(cookieParser())
server.use(addTraceHeader)
server.use(ENDPOINT_PATH_PREFIX, featuresRouter)
server.use(globalErrorHandler)