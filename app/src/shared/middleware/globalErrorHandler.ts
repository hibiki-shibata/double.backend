import type { Request, Response, NextFunction } from 'express'
import { HttpBaseErr } from '../error/httpErrors.js'
import { InternalServerBaseErr } from '../error/serverErros.js'
import { PrismaClientKnownRequestError } from '../infra/db/generated.prisma/internal/prismaNamespace.js'

type ErrorResponse = {
    code: string
    message: string
    requestId?: string
}

export function globalErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): Response {
    let resBody: ErrorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
        requestId: req.requestId
    }

    if (err instanceof HttpBaseErr) {
        req.logger.error({ err }, 'httpException was handled')
        resBody = {
            code: err.code,
            message: err.message,
            requestId: req.requestId
        }
        return res.status(err.statusCode).json(resBody)

    }

    if (err instanceof InternalServerBaseErr) {
        req.logger.error({ err }, 'InternalServerException was handled')
        return res.status(err.statusCode).json(resBody)
    }

    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' })
        if (err.code === 'P2002') return res.status(409).json({ message: 'Already exists' })
    }

    req.logger.error({ err }, 'Unexpected Exception was thrown')
    return res.status(500).json(resBody)
}