import type { Request, Response } from "express"
import type { AccessTokenResponse, UserLoginRequest, UserSignupRequest } from "../schema/userAuth.schema.js"

export interface UserAuthController {
    signup(
        req: Request<unknown, unknown, UserSignupRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void>
    login(
        req: Request<unknown, unknown, UserLoginRequest>,
        res: Response<AccessTokenResponse>
    ): Promise<void>
    refreshToken(
        req: Request<unknown, unknown, void>,
        res: Response<AccessTokenResponse>
    ): Promise<void>
    logout(
        req: Request<unknown, unknown, void>,
        res: Response<void>
    ): Promise<void>
}