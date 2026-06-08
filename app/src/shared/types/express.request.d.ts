// To insert request ID in the ../shared/middleware/addTraceHeader.ts
declare namespace Express {
    interface Request {
        requestId: string
        logger: pino.Logger
        accessTokenClaim: AccessTokenClaim
    }
}