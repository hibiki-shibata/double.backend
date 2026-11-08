// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "@global-shared/config/security.config.js"
import { userShape } from "../../user/shared/schema/user.schema.shape.js"

// Request
export const SignupRequestSchema = z.object({
    userName: userShape.name,
    password: userShape.password
})
export type SignupRequest = z.infer<typeof SignupRequestSchema>


export const LoginRequestSchema = z.object({
    userName: userShape.name,
    password: userShape.password
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>



// Response
const jwtTokenShape = z.jwt({ alg: jwtOptions.algorithm })


export const AccessTokenResponseSchema = z.object({
    accessToken: jwtTokenShape
})
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>


export const JwtTokensSchema = z.object({
    accessToken: jwtTokenShape,
    refreshToken: jwtTokenShape
})
export type JwtTokens = z.infer<typeof JwtTokensSchema>