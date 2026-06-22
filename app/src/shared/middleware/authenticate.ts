import type { Request, Response, NextFunction } from "express"
import type { AccessTokenClaim } from "@global-shared/auth/type/jwtToken.type.js"
import { jwtTokenService } from "@global-shared/auth/index.js"
import { loggerContext } from "@global-shared/logger/logger.js"
import { UnauthenticatedErr } from "@global-shared/error/httpErrors.js"
import type { Logger } from "pino"
import { MissingAuthenticateMiddleware } from "@global-shared/error/serverErros.js"

const BEARER_PREFIX = 'Bearer '

export function authenticate(
    req: Request, _res: Response, next: NextFunction
): void {
    const rawToken: string | undefined = req.header('Authorization')
    if (!rawToken?.startsWith(BEARER_PREFIX)) {
        throw new UnauthenticatedErr('JWT token not found in request header')
    }

    const accessTokenClaim: AccessTokenClaim = jwtTokenService.verifyAccessToken(
        rawToken.slice(BEARER_PREFIX.length)
    )

    req.accessTokenClaim = accessTokenClaim

    const logger: Logger = loggerContext.getLogger().child({ userId: accessTokenClaim.userId })
    loggerContext.run(logger, () => {
        next()
    })
}