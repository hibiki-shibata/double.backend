import type { UserRoles } from "../../infra/db/generated.prisma/enums.js"
import type { AccessTokenClaim, RefreshTokenClaim } from "../type/jwtToken.type.js"

export interface JwtTokenService {
    generateAccessToken(userId: string, userName: string, roles: UserRoles[]): string
    generateRefreshToken(userId: string): string
    verifyAccessToken(token: string): AccessTokenClaim
    verifyRefreshToken(token: string): RefreshTokenClaim
}