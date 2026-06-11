// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "../../../../shared/config/security.config.js"
import { userSchema } from "../../shared/user.schema.js"

export const UserSignupRequestSchema = z.object({
    userName: userSchema.name,
    password: userSchema.password
})

export const UserLoginRequestSchema = z.object({
    userName: userSchema.name,
    password: userSchema.password
})

export const AccessTokenResponseSchema = z.object({
    accessToken: z.jwt({ alg: jwtOptions.algorithm })
})

export type UserSignupRequest = z.infer<typeof UserSignupRequestSchema>
export type UserLoginRequest = z.infer<typeof UserLoginRequestSchema>
export type AccessTokenResponse = z.infer<typeof AccessTokenResponseSchema>