type JwtConfig = {
    accessTokenExpiry: string,
    refreshTokenExpiry: string | number,
    issuer: string
    algorithm: string
}

export const jwtConfig: JwtConfig = {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    issuer: 'double-backend',
    algorithm: 'HS256' as const,
} as const