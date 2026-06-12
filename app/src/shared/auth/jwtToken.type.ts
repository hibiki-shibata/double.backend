import type { UserRoles } from "../infra/db/generated.prisma/enums.js"

export type JwtTokensDTO = {
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
    roles: UserRoles[]
    iat: number
    exp?: number,
    iss?: string
}

export type RefreshTokenClaim = {
    type: TokenType.refreshToken
    tokenId: string,
    userId: string,
    exp?: number,
    iss?: string
}