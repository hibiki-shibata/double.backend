// This is for re-define Express's Request type for custom value add in middlewares
import type { Logger } from "pino"
import type { AccessTokenClaim, RefreshTokenClaim } from "@global-shared/auth/type/jwtToken.type.ts"
import type { Pagination } from "./pagination.type.ts"


declare global {
    declare namespace Express {
        interface Request {
            requestId: string
            logger: Logger
            accessTokenClaim: AccessTokenClaim
            refreshToken: string
            pagination: Pagination
        }
    }
}