import type { JwtTokens } from "../schema/userAuth.schema.js"
import type { UserLoginRequest, UserSignupRequest } from "../schema/userAuth.schema.js"

export interface UserAuthService {
    signup(dto: UserSignupRequest): Promise<JwtTokens>
    login(dto: UserLoginRequest): Promise<JwtTokens>
    refreshToken(refreshToken: string): Promise<JwtTokens>
}