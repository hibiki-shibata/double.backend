import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid'
import { baseLogger } from "@global-shared/logger/logger.js";
import type { Logger } from "pino";
import { contextLoggerStorage } from "@global-shared/logger/logger.js";

export function addTraceHeader(
    req: Request, res: Response, next: NextFunction
): void {
    const requestId: string = req.header('x-request-id') ?? uuidv4()

    res.setHeader('x-request-id', requestId)

    const logger: Logger = baseLogger.child({ requestId: requestId })
    contextLoggerStorage.run(logger, () => {
        next()
    })
}

// Deprecated - REMOVE LATER
// export function addTraceHeader(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): void {
//     const requestId: string = req.header('x-request-id') ?? uuidv4()
//     req.logger = logger.child({ requestId: requestId })
//     req.requestId = requestId
//     res.setHeader('x-request-id', requestId)
//     next()
// }
