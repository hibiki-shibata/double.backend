import type { Request, Response } from "express"

export type UserAccountController = {
    getMyAccount(req: Request, res: Response): Promise<void>
    updateMyAccount(req: Request, res: Response): Promise<void>
    deleteMyAccount(req: Request, res: Response): Promise<void>
}