import type { Request, Response, NextFunction } from "express"
import { Unauthenticated } from "../exception/httpException.js"
import { jwtTokenService } from "../auth/index.js"
import type { AccessTokenClaim } from "../auth/type/jwtToken.type.js"
import { logger } from "../logger/logger.js"

const BEARER_PREFIX = 'Bearer '

export function validateAuth(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const rawToken: string | undefined = req.header('Authorization')
    if (!rawToken?.startsWith(BEARER_PREFIX)) {
        throw new Unauthenticated('JWT token not found in request header')
    }

    const accessTokenClaim: AccessTokenClaim = jwtTokenService.verifyAccessToken(
        rawToken.slice(BEARER_PREFIX.length)
    )
    req.accessTokenClaim = accessTokenClaim

    logger.child({ userId: accessTokenClaim.userId })
    next()
}
