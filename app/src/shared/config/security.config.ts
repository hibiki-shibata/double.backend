// Doc: https://expressjs.com/en/resources/middleware/cors/
import "dotenv/config"
import type { CorsOptions } from "cors"
import jwt from 'jsonwebtoken'
import ms from 'ms'
import { type Options } from 'express-rate-limit'

type PasswordEncoderConfig = {
    min_salt_rounds: number,
    max_salt_round: number,
    saltRound: number
}

type JwtConfig = {
    accessTokenExpiry: number | ms.StringValue,
    refreshTokenExpiry: number | ms.StringValue,
    issuer: string,
    algorithm: jwt.Algorithm,
    maxSecretLength: number,
    minSecretLength: number,
    secretKey: string
}

export const passwordEncoderConfig: PasswordEncoderConfig = {
    min_salt_rounds: 10,
    max_salt_round: 15,
    saltRound: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10)
}

export const jwtConfig: JwtConfig = {
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

export const rateLimitConfig: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    limit: parseInt(process.env.RATE_LIMIT ?? '100', 10), // 100 req/ 15 mins
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // store: ... , // Note: Implement Redis later
}

export const corsConfig: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

export const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
} as const