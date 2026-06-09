// This is for re-define Express's Request type for custom value add in middlewares
import type { AccessTokenClaim, RefreshTokenClaim } from "../auth/type/jwtToken.type.ts"
import type { Logger } from "pino"


declare global {
    declare namespace Express {
        interface Request {
            requestId: string
            logger: Logger
            accessTokenClaim: AccessTokenClaim
            refreshToken: string
        }
    }
}