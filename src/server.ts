// entry point / gracefulshut down
import "dotenv/config"
import express from 'express'
import { type Express } from 'express'
import { featuresRouter } from "./features/featuresRouter.js"
import { globalExceptionHandler } from "./shared/middleware/globalExceptionHandler.js"

export const port: string = process.env.PORT_NUMBER ?? "5000"
export const server: Express = express()

server.use(express.json())
server.use('/api', featuresRouter)
server.use(globalExceptionHandler)