// This is for re-define Express's Request type for custom value add in middlewares
import type { Logger } from "pino"
import type { Request } from "express"
import type { AccessTokenClaim, RefreshTokenClaim } from "@global-shared/auth/type/jwtToken.type.ts"
import type { Pagination } from "./pagination.type.ts"

declare global {
    namespace Express {
        interface Request {
            accessTokenClaim?: AccessTokenClaim
        }
    }
}

// export type AuthenticatedRquest = {
//     accessTokenClaim: AccessTokenClaim
// }