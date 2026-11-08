import express, { type Express } from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { rateLimitOptions, corsOptions } from '@global-shared/config/security.config.js'
import { ENDPOINT_PATH_PREFIX } from '@global-shared/config/env.config.js'
import { addTraceHeader } from '@global-shared/middleware/addTraceHeader.js'
import { globalErrorHandler } from "@global-shared/middleware/globalErrorHandler.js"
import { featuresRouter } from "./features/features.router.js"
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