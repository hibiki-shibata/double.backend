import type { Request, Response } from "express"
import type { UserAccountEditRequest, UserAccountResponse } from "../schema/userAccount.schema.js"

export interface UserAccountController {
    getMyAccount(
        req: Request<unknown, unknown, unknown>,
        res: Response<UserAccountEditRequest>
    ): Promise<void>
    updateMyAccount(
        req: Request<unknown, unknown, UserAccountEditRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void>
    deleteMyAccount(
        req: Request<unknown, unknown, unknown>,
        res: Response<void>
    ): Promise<void>
}