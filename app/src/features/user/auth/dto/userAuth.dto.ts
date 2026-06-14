// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "../../../../shared/config/security.config.js"
import { userSchema } from "../../shared/schema/user.schema.js"

export const UserSignupRequestSchema = z.object({
    userName: userSchema.name,
    password: userSchema.password
})

export const UserLoginRequestSchema = z.object({
    userName: userSchema.name,
    password: userSchema.password
})

const jwtTokenSchema = z.jwt({ alg: jwtOptions.algorithm })

export const AccessTokenResponseSchema = z.object({
    accessToken: jwtTokenSchema
})

export const JwtTokensSchema = z.object({
    accessToken: jwtTokenSchema,
    refreshToken: jwtTokenSchema
})

export type UserSignupRequest = z.infer<typeof UserSignupRequestSchema>
export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>
export type JwtTokens = z.infer<typeof JwtTokensSchema>