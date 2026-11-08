import type { JwtTokens, LoginRequest, SignupRequest } from "../schema/auth.schema.js"

export interface AuthService {
    signup(dto: SignupRequest): Promise<JwtTokens>
    login(dto: LoginRequest): Promise<JwtTokens>
    refreshToken(refreshToken: string): Promise<JwtTokens>
}