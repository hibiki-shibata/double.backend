import z from "zod"
import { passwordField, userNameField } from "../config/dto.config.js"
import { jwtOptions } from "../../../shared/config/security.config.js"


const UserSignupRequest = z.object({
    userName: userNameField,
    password: passwordField
})
export type UserSignupRequest = z.infer<typeof UserSignupRequest>

const UserLoginRequest = z.object({
    userName: userNameField,
    password: passwordField
})
export type UserLoginRequest = z.infer<typeof UserLoginRequest>


const AccessTokenResponse = z.object({
    accessToken: z.jwt(jwtOptions.algorithm)
})
export type AccessTokenResponse = z.infer<typeof AccessTokenResponse>