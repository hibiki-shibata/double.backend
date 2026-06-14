import type { JwtTokens } from "../dto/userAuth.dto.js"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"

export type UserAuthService = {
    signup(dto: UserSignupRequest): Promise<JwtTokens>
    login(dto: UserLoginRequest): Promise<JwtTokens>
    refreshToken(refreshToken: string): Promise<JwtTokens>
}