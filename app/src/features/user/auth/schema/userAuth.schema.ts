// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "@global-shared/config/security.config.js"
import { userShape } from "../../shared/schema/user.schema.shape.js"

// Request
export const UserSignupRequestSchema = z.object({
    userName: userShape.name,
    password: userShape.password
})
export type UserSignupRequest = z.infer<typeof UserSignupRequestSchema>


export const UserLoginRequestSchema = z.object({
    userName: userShape.name,
    password: userShape.password
})
export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>

// Response
const jwtTokenShape = z.jwt({
    alg: jwtOptions.algorithm
})

export const AccessTokenResponseSchema = z.object({
    accessToken: jwtTokenShape
})
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>


export const JwtTokensSchema = z.object({
    accessToken: jwtTokenShape,
    refreshToken: jwtTokenShape
})
export type JwtTokens = z.infer<typeof JwtTokensSchema>