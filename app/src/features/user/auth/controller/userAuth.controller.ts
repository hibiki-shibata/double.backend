import type { Request, Response } from "express"

export type UserAuthController = {
    signup(req: Request, res: Response): Promise<void>
    login(req: Request, res: Response): Promise<void>
    signup(req: Request, res: Response): Promise<void>
    refreshToken(req: Request, res: Response): Promise<void>
    logout(req: Request, res: Response): Promise<void>
}