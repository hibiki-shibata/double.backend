import type { UserRoles } from "../infra/db/generated.prisma/enums.js"

export type JwtTokenResponse = {
    accessToken: string,
    refreshToken: string
}

export type AccessTokenClaim = {
    userId: string,
    userName: string,
    roles: UserRoles
    issuer: string,
    exp: Date,
    iat: Date
}

export type RefreshTokenClaim = {
    tokenId: string,
    userId: string,
    exp: string,
}