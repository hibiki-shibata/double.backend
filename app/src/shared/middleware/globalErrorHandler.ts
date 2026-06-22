import type { Request, Response, NextFunction } from 'express'
import { HttpBaseErr } from '@global-shared/error/httpErrors.js'
import { InternalServerBaseErr } from '@global-shared/error/serverErros.js'
import { PrismaClientKnownRequestError } from '@global-shared/infra/db/generated.prisma/internal/prismaNamespace.js'
import { loggerContext } from '@global-shared/logger/logger.js'

type ErrorResponse = {
    code: string
    message: string
    requestId?: string
}

export function globalErrorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response {
    const logger = loggerContext.getLogger()

    let resBody: ErrorResponse = {
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
    }

    if (err instanceof HttpBaseErr) {
        logger.error({ err }, 'httpException was handled')
        resBody = {
            code: err.code,
            message: err.message,
        }
        return res.status(err.statusCode).json(resBody)

    }

    if (err instanceof InternalServerBaseErr) {
        logger.error({ err }, 'InternalServerException was handled')
        return res.status(err.statusCode).json(resBody)
    }

    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' })
        if (err.code === 'P2002') return res.status(409).json({ message: 'Already exists' })
    }

    logger.error({ err }, 'Unexpected Exception was thrown')
    return res.status(500).json(resBody)
}