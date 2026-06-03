// entry point / gracefulshut down
import "dotenv/config"
import express from 'express'
import type { Express } from 'express'

export const server: Express = express()
export const port: string = process.env.PORT_NUMBER ?? "5000"

server.use(express.json())
// app.use('api/' features)
// app.use(errorHandler)