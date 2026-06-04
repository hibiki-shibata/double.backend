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
    const requestId = req.headers['x-request-id'] as string

    if (err instanceof HttpException) {
        const handledErrBody: ErrorResponse = {
            code: err.code,
            message: err.message,
            requestId: requestId
        }
        res.status(err.statusCode).json(handledErrBody)
        return
    }

    logger.error({ err }, 'Unexpected Server Error')

    const unexpectedErrBody: ErrorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected Server Error',
        requestId: requestId
    }
    res.status(500).json(unexpectedErrBody)
}