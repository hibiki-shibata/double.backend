// Doc: https://expressjs.com/en/resources/middleware/cors/
import type ms from 'ms'
import type { Options } from 'express-rate-limit'
import type { CorsOptions } from "cors"
import type { CookieOptions } from "express"
import type { Algorithm } from 'jsonwebtoken'

export type PasswordEncoderOptions = {
    maxSaltRound: number,
    minSaltRound: number,
    saltRound: number
}
const MIN_SALT_ROUND = 10
const MAX_SALT_ROUND = 15

export const passwordEncoderOptions: PasswordEncoderOptions = {
    minSaltRound: MIN_SALT_ROUND,
    maxSaltRound: MAX_SALT_ROUND,
    saltRound: (() => {
        const raw = process.env.BCRYPT_SALT_ROUNDS ?? '12'
        const saltRound = Number(raw)

        if (!Number.isInteger(saltRound) || saltRound < MIN_SALT_ROUND || saltRound > MAX_SALT_ROUND) {
            throw new Error(
                `BCRYPT_SALT_ROUNDS must be an integer between ${MIN_SALT_ROUND} and ${MAX_SALT_ROUND} (received: "${raw}")`
            )
        }

        return saltRound
    })()
}

export type JwtOptions = {
    accessTokenExpireIn: ms.StringValue,
    refreshTokenExpireIn: ms.StringValue,
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