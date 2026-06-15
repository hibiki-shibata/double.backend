import { describe, test, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { globalErrorHandler } from '../../../src/shared/middleware/globalErrorHandler.js'
import { UnauthenticatedErr } from '../../../src/shared/error/httpErrors.js'
import { UnexpectedEnvVarErr } from '../../../src/shared/error/serverErros.js'

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
    const err = new UnauthenticatedErr('Invalid token')
    globalErrorHandler (err, req, res, vi.fn() as NextFunction)

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
    const err = new UnexpectedEnvVarErr('JWT_SECRET')

    globalErrorHandler (err, req, res, vi.fn() as NextFunction)

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

    globalErrorHandler (err, req, res, vi.fn() as NextFunction)

    expect(req.logger.error).toHaveBeenCalledWith({ err }, 'Unexpected Exception was thrown')
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
      requestId: 'request-id'
    })
  })
})