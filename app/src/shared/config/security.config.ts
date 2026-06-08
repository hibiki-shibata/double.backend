// Doc: https://expressjs.com/en/resources/middleware/cors/
import "dotenv/config"
import type { CorsOptions } from "cors"
import jwt from 'jsonwebtoken'
import ms from 'ms'

export const corsConfig: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

type PasswordEncoderConfig = {
    min_salt_rounds: number,
    max_salt_round: number,
    saltRound: number
}

export const passwordEncoderConfig: PasswordEncoderConfig = {
    min_salt_rounds: 10,
    max_salt_round: 15,
    saltRound: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '', 10)
}


type JwtConfig = {
    accessTokenExpiry: number | ms.StringValue,
    refreshTokenExpiry: number | ms.StringValue,
    issuer: string,
    algorithm: jwt.Algorithm,
    secretKey: string
}

export const jwtConfig: JwtConfig = {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    algorithm: 'HS256',
    secretKey: process.env.JWT_SECRET_KEY ?? '',
    issuer: 'double-backend'
}