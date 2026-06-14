import { describe, test, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { globalExceptionHandler } from '../../../src/shared/middleware/globalErrorHandler.js'
import { Unauthenticated } from '../../../src/shared/error/httpErrors.js'
import { UnexpectedEnvVar } from '../../../src/shared/error/serverErros.js'

function createReq(): Request {
  return {
    requestId: 'request-id',
    logger: {
      error: vi.fn()
    }
  } as unknown as Request
}

function createRes(): Response {
  const res = {
    status: vi.fn(),
    json: vi.fn()
  }

  res.status.mockReturnValue(res)

  return res as unknown as Response
}

describe('globalExceptionHandler', () => {
  test('handle HttpBaseException', () => {
    const req = createReq()
    const res = createRes()
    const err = new Unauthenticated('Invalid token')
    globalExceptionHandler(err, req, res, vi.fn() as NextFunction)

    expect(req.logger.error).toHaveBeenCalledWith({ err }, 'httpException was handled')
    expect(res.status).toHaveBeenCalledWith(err.statusCode)
    expect(res.json).toHaveBeenCalledWith({
      code: err.code,
      message: err.message,
      requestId: 'request-id'
    })
  })

  test('handle InternalServerBaseException', () => {
    const req = createReq()
    const res = createRes()
    const err = new UnexpectedEnvVar('JWT_SECRET')

    globalExceptionHandler(err, req, res, vi.fn() as NextFunction)

    expect(req.logger.error).toHaveBeenCalledWith({ err }, 'InternalServerException was handled')
    expect(res.status).toHaveBeenCalledWith(err.statusCode)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
      requestId: 'request-id'
    })
  })

  test('handle unexpected Error', () => {
    const req = createReq()
    const res = createRes()
    const err = new Error('unexpected')

    globalExceptionHandler(err, req, res, vi.fn() as NextFunction)

    expect(req.logger.error).toHaveBeenCalledWith({ err }, 'Unexpected Exception was thrown')
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
      requestId: 'request-id'
    })
  })
})