// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "../../../../shared/config/security.config.js"
import { userSchema } from "../../shared/user.schema.js"

export const UserSignupRequest = z.object({
    userName: userSchema.name,
    password: userSchema.password
})

export const UserLoginRequest = z.object({
    userName: userSchema.name,
    password: userSchema.password
})

export const AccessTokenResponse = z.object({
    accessToken: z.jwt({ alg: jwtOptions.algorithm })
})

export type UserSignupRequest = z.infer<typeof UserSignupRequest>
export type UserLoginRequest = z.infer<typeof UserLoginRequest>
export type AccessTokenResponse = z.infer<typeof AccessTokenResponse>