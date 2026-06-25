// https://zod.dev/api#jwts
import z from "zod"
import { jwtOptions } from "@global-shared/config/security.config.js"
import { userShape } from "../../shared/schema/user.schema.shape.js"


const jwtTokenShape = z.jwt({ alg: jwtOptions.algorithm })

export const userAuthSchema = {
    SignupRequest: z.object({
        userName: userShape.name,
        password: userShape.password
    }),

    loginRequest: z.object({
        userName: userShape.name,
        password: userShape.password
    }),

    accessTokenResponse: z.object({
        accessToken: jwtTokenShape
    }),

    jwtTokens: z.object({
        accessToken: jwtTokenShape,
        refreshToken: jwtTokenShape
    })
}


// Request
export type UserSignupRequest = z.infer<typeof userAuthSchema.SignupRequest>

export type UserLoginRequest = z.infer<typeof userAuthSchema.loginRequest>

// Response
export type AccessTokenResponse = z.infer<typeof userAuthSchema.accessTokenResponse>

export type JwtTokens = z.infer<typeof userAuthSchema.jwtTokens>