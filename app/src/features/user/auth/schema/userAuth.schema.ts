// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "../../../../shared/config/security.config.js"
import { userShape } from "../../shared/schema/user.schema.shape.js"

// Request
export const UserSignupRequestSchema = z.object({
    userName: userShape.name,
    password: userShape.password
})

export const UserLoginRequestSchema = z.object({
    userName: userShape.name,
    password: userShape.password
})

// Response
const jwtTokenShape = z.jwt({
    alg: jwtOptions.algorithm
})

export const AccessTokenResponseSchema = z.object({
    accessToken: jwtTokenShape
})

export const JwtTokensSchema = z.object({
    accessToken: jwtTokenShape,
    refreshToken: jwtTokenShape
})

export type UserSignupRequest = z.infer<typeof UserSignupRequestSchema>
export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>
export type JwtTokens = z.infer<typeof JwtTokensSchema>