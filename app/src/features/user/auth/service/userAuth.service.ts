import type { JwtTokens } from "../schema/userAuth.schema.js"

export namespace UserAuthServceArgs {
    export type Signup = {
        userName: string
        password: string
    }
    export type Login = {
        userName: string
        password: string
    }
    export type RefreshToken = {
        refreshToken: string
    }
}


export interface UserAuthService {
    signup(dto: UserAuthServceArgs.Signup): Promise<JwtTokens>
    login(dto: UserAuthServceArgs.Login): Promise<JwtTokens>
    refreshToken(dto: UserAuthServceArgs.RefreshToken): Promise<JwtTokens>
    logout(dto: UserAuthServceArgs.RefreshToken): Promise<null>
}