import type { Request, Response } from "express"
import type { AccessTokenResponse, LoginRequest, SignupRequest } from "../schema/auth.schema.js"

export interface AuthController {
    signup(req: Request<any, any, SignupRequest>, res: Response<AccessTokenResponse>): Promise<void>
    login(req: Request<any, any, LoginRequest>, res: Response<AccessTokenResponse>): Promise<void>
    refreshToken(req: Request, res: Response<AccessTokenResponse>): Promise<void>
    logout(req: Request, res: Response<void>): Promise<void>
}