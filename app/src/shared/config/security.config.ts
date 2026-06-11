// Doc: https://expressjs.com/en/resources/middleware/cors/
import "dotenv/config"
import jwt from 'jsonwebtoken'
import ms from 'ms'
import type { Options } from 'express-rate-limit'
import type { CorsOptions } from "cors"
import type { CookieOptions } from "express"

type PasswordEncoderOptions = {
    min_salt_rounds: number,
    max_salt_round: number,
    saltRound: number
}
export const passwordEncoderOptions: PasswordEncoderOptions = {
    min_salt_rounds: 10,
    max_salt_round: 15,
    saltRound: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10)
}

type JwtOptions = {
    accessTokenExpiry: number | ms.StringValue,
    refreshTokenExpiry: number | ms.StringValue,
    issuer: string,
    algorithm: jwt.Algorithm,
    maxSecretLength: number,
    minSecretLength: number,
    secretKey: string
}
export const jwtOptions: JwtOptions = {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    issuer: 'double-backend',
    algorithm: 'HS256',
    maxSecretLength: 70,
    minSecretLength: 32,
    secretKey: (() => {
        const secret = process.env.JWT_SECRET_KEY ?? undefined
        if (!secret || secret.length <= 30 || secret.length >= 70) throw new Error('JWT_SECRET_KEY must be between 32 and 70 characters')
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