import jwt from 'jsonwebtoken'
import ms from 'ms'

type JwtConfig = {
    accessTokenExpiry: number | ms.StringValue,
    refreshTokenExpiry: number | ms.StringValue,
    issuer: string
    algorithm: jwt.Algorithm
}

export const jwtConfig: JwtConfig = {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    issuer: 'double-backend',
    algorithm: 'HS256',
}