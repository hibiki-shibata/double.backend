import { type AccessTokenClaim, type RefreshTokenClaim } from "../type/jwtToken.type.js"

export type JwtTokenService = {
    generateAccessToken(claim: AccessTokenClaim): string
    generateRefreshToken(claim: RefreshTokenClaim): string
    verifyAccessToken(token: string): AccessTokenClaim
    verifyRefreshToken(token: string): RefreshTokenClaim
}