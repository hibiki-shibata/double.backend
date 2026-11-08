import z from "zod"
import { jwtOptions } from "@global-shared/config/security.config.js"
import { UserShape } from "../../shared/schema/user.schema.shape.js"

const jwtTokenShape = z.jwt({ alg: jwtOptions.algorithm })

export const UserAuthSchema = {
    SignupRequest: z.object({
        userName: UserShape.name,
        password: UserShape.password
    }),

    loginRequest: z.object({
        userName: UserShape.name,
        password: UserShape.password
    }),

    accessTokenResponse: z.object({
        accessToken: jwtTokenShape
    }),

    jwtTokens: z.object({
        accessToken: jwtTokenShape,
        refreshToken: jwtTokenShape
    })
}

// Request Types
export type UserSignupRequest = z.infer<typeof UserAuthSchema.SignupRequest>
export type UserLoginRequest = z.infer<typeof UserAuthSchema.loginRequest>
// Response Types
export type AccessTokenResponse = z.infer<typeof UserAuthSchema.accessTokenResponse>
export type JwtTokens = z.infer<typeof UserAuthSchema.jwtTokens>