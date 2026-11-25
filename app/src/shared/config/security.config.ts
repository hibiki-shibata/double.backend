// Doc: https://expressjs.com/en/resources/middleware/cors/
import ms from 'ms'
import type { Options } from 'express-rate-limit'
import type { CorsOptions } from "cors"
import type { CookieOptions } from "express"
import type { Algorithm } from 'jsonwebtoken'
import { env, isDevMode, isStageMode } from './env.js'

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
    saltRound: isStageMode ? 4 : env.BCRYPT_SALT_ROUNDS,
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

const ACCESS_TOKEN_EXPIRE_IN: ms.StringValue = '15m'

export const jwtOptions: JwtOptions = {
    accessTokenExpireIn: ACCESS_TOKEN_EXPIRE_IN,
    refreshTokenExpireIn: '30d',
    issuer: 'double-backend',
    algorithm: 'HS256',
    maxSecretLen: 70,
    minSecretLen: 32,
    secretKey: env.JWT_SECRET_KEY,
}

export const rateLimitOptions: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    limit: env.RATE_LIMIT_MAX, // 100 req/ 15 mins
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // store: ... , // Note: Implement Redis later
}

export const corsOptions: CorsOptions = {
    origin: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    credentials: true,
    optionsSuccessStatus: 200,
}

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: !isDevMode,
    sameSite: 'strict',
    maxAge: ms(ACCESS_TOKEN_EXPIRE_IN),
}