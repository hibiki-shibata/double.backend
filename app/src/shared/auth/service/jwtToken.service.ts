import type { UserRoles } from "../../infra/db/generated.prisma/enums.js"
import type { AccessTokenClaim, RefreshTokenClaim } from "../type/jwtToken.type.js"

export type GenerateAccessTokenInput = {
    userId: string,
    userName: string,
    roles: UserRoles[]
}

export type GenerateRefreshTokenInput = {
    userId: string
}

export interface JwtTokenService {
    generateAccessToken(input: GenerateAccessTokenInput): string
    generateRefreshToken(input: GenerateRefreshTokenInput): string
    verifyAccessToken(token: string): AccessTokenClaim
    verifyRefreshToken(token: string): RefreshTokenClaim
}