import type { Request, Response, NextFunction } from 'express'
import { HttpBaseException } from '../exception/httpException.js'
import { InternalServerBaseException } from '../exception/serverException.js'

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
    let resBody: ErrorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
        requestId: req.requestId
    }

    if (err instanceof HttpBaseException) {
        req.logger.error({ err }, 'httpException was handled')
        resBody = {
            code: err.code,
            message: err.message,
            requestId: req.requestId
        }
        res.status(err.statusCode).json(resBody)
        return
    }

    if (err instanceof InternalServerBaseException) {
        req.logger.error({ err }, 'InternalServerException was handled')
        res.status(err.statusCode).json(resBody)
        return
    }

    req.logger.error({ err }, 'Unexpected Exception was thrown')
    res.status(500).json(resBody)
}