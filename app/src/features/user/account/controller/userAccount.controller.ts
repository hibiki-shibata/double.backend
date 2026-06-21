import type { Request, Response } from "express"

export interface UserAccountController {
    getMyAccount(req: Request, res: Response): Promise<void>
    updateMyAccount(req: Request, res: Response): Promise<void>
    deleteMyAccount(req: Request, res: Response): Promise<void>
}