// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "../../../shared/config/security.config.js"
import { user } from "./shared.js"

const UserSignupRequest = z.object({
    userName: user.name,
    password: user.password
})

const UserLoginRequest = z.object({
    userName: user.name,
    password: user.password
})

const AccessTokenResponse = z.object({
    accessToken: z.jwt({ alg: jwtOptions.algorithm })
})

export type UserSignupRequest = z.infer<typeof UserSignupRequest>
export type UserLoginRequest = z.infer<typeof UserLoginRequest>
export type AccessTokenResponse = z.infer<typeof AccessTokenResponse>