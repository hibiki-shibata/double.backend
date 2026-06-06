import type { UserRoles } from "../infra/db/generated.prisma/enums.js"

export type JwtTokenResponse = {
    accessToken: string,
    refreshToken: string
}

export enum TokenType {
    accessToken,
    refreshToken
}

export type AccessTokenClaim = {
    type: TokenType.accessToken
    userId: string,
    userName: string,
    roles: UserRoles
    issuer: string,
    exp: Date,
    iat: Date
}

export type RefreshTokenClaim = {
    type: TokenType.refreshToken
    tokenId: string,
    userId: string,
    exp: string,
}