import type { UserRoles } from "../../infra/db/generated.prisma/enums.js"

export enum TokenType {
    accessToken,
    refreshToken
}

export type AccessTokenClaim = {
    userId: string,
    userName: string,
    roles: UserRoles[]
    type: TokenType.accessToken
    iat?: number
    jti?: string
    exp?: number
    iss?: string
}

export type RefreshTokenClaim = {
    userId: string,
    type: TokenType.refreshToken
    iat?: number
    jti?: string
    exp?: number
    iss?: string
}