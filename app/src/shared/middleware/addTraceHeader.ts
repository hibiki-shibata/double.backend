import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid'
import { loggerContext } from "@global-shared/logger/logger.js";
import type { Logger } from "pino";

export function addTraceHeader(
    req: Request, res: Response, next: NextFunction
): void {
    const requestId: string = req.header('x-request-id') ?? uuidv4()

    res.setHeader('x-request-id', requestId)

    const logger: Logger = loggerContext.getLogger().child({ requestId: requestId })
    loggerContext.run(logger, () => {
        next()
    })
}

// // Deprecated - REMOVE LATER
// export function addTraceHeader(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): void {
//     const requestId: string = req.header('x-request-id') ?? uuidv4()
//     req.requestId = requestId
//     // or
//     // req.logger = logger.child({ requestId: requestId })
//     res.setHeader('x-request-id', requestId)
//     next()
// }
