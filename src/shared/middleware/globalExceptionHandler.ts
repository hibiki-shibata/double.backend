import type { Request, Response, NextFunction } from 'express'
import { logger } from '../logger/logger.js'
import { HttpException } from '../exception/httpException.js'

type ErrorResponse = {
    code: string
    message: string
    requestId?: string
}

export function globalExceptionHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const requestId: string = req.requestId

    if (err instanceof HttpException) {
        logger.error({ requestId, err, }, 'httpException was thrown')
        const httpExceptionBody: ErrorResponse = {
            code: err.code,
            message: err.message,
            requestId: requestId
        }
        res.status(err.statusCode).json(httpExceptionBody)
        return
    }

    logger.error({ requestId, err, }, 'Unexpected Error was thrown')
    const unexpectedErrBody: ErrorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected Server Error',
        requestId: requestId
    }
    res.status(500).json(unexpectedErrBody)
}