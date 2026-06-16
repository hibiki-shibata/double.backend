// Doc: https://expressjs.com/en/resources/middleware/cors/
import ms from 'ms'
import type { Options } from 'express-rate-limit'
import type { CorsOptions } from "cors"
import type { CookieOptions } from "express"
import type { Algorithm } from 'jsonwebtoken'

export type PasswordEncoderOptions = {
    maxSaltRound: number,
    minSaltRound: number,
    saltRound: number
}
export const passwordEncoderOptions: PasswordEncoderOptions = {
    maxSaltRound: 15,
    minSaltRound: 10,
    saltRound: (() => {
        const saltRound: number = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10)
        if (saltRound <= 10 || saltRound >= 15) throw new Error('BCRYPT_SALT_ROUTNDS must be between 10 and 15 characters')
        return saltRound
    })()
}

export type JwtOptions = {
    accessTokenExpireIn: number | ms.StringValue,
    refreshTokenExpireIn: number | ms.StringValue,
    issuer: string,
    algorithm: Algorithm
    maxSecretLen: number,
    minSecretLen: number,
    secretKey: string,
}
export const jwtOptions: JwtOptions = {
    accessTokenExpireIn: '15m',
    refreshTokenExpireIn: '30d',
    issuer: 'double-backend',
    algorithm: 'HS256',
    maxSecretLen: 70,
    minSecretLen: 32,
    secretKey: (() => {
        const secret = process.env.JWT_SECRET_KEY ?? undefined
        if (!secret) throw new Error('Missing Jwt secret key in process env')
        if (secret.length < 32 || secret.length > 70) throw new Error('JWT_SECRET_KEY must be between 32 and 70 characters')
        return secret
    })()
}

export const rateLimitOptions: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    limit: parseInt(process.env.RATE_LIMIT ?? '100', 10), // 100 req/ 15 mins
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // store: ... , // Note: Implement Redis later
}

export const corsOptions: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 900000
}