import type { JwtTokens } from "../schema/userAuth.schema.js"

export namespace UserAuthServceParams {
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
    signup(dto: UserAuthServceParams.Signup): Promise<JwtTokens>
    login(dto: UserAuthServceParams.Login): Promise<JwtTokens>
    refreshToken(dto: UserAuthServceParams.RefreshToken): Promise<JwtTokens>
}