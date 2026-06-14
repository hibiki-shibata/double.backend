import type { Request, Response, NextFunction } from "express"
import type { AccessTokenClaim } from "../auth/type/jwtToken.type.js"
import { UnauthenticatedErr } from "../error/httpErrors.js"
import { logger } from "../logger/logger.js"
import { jwtTokenService } from "../auth/index.js"

const BEARER_PREFIX = 'Bearer '

export function validateAuth(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const rawToken: string | undefined = req.header('Authorization')
    if (!rawToken?.startsWith(BEARER_PREFIX)) {
        throw new UnauthenticatedErr('JWT token not found in request header')
    }

    const accessTokenClaim: AccessTokenClaim = jwtTokenService.verifyAccessToken(
        rawToken.slice(BEARER_PREFIX.length)
    )
    req.accessTokenClaim = accessTokenClaim

    logger.child({ userId: accessTokenClaim.userId })
    next()
}
