import type { UserAccountResponse } from "../dto/userAccount.dto.js"
import { toUserAccountRequest } from "../mapper/userAccount.mapper.js"
import { userAccountService } from "../service/userAccount.service.js"
import type { Request, Response } from 'express'

// Implement zod
export const UserAccountController = {

    async getMyAccountData(
        req: Request,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const user: UserAccountResponse = await userAccountService.getMyAccount(toUserAccountRequest(req))
        res.status(200).json(user)
    },

    async putUpdatedMyAccount(
        req: Request,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const updatedUser: UserAccountResponse = await userAccountService.updateMyAccount(toUserAccountRequest(req))
        res.status(200).json(updatedUser)
    },

    async deleteMyAccount(
        req: Request,
        res: Response
    ): Promise<void> {
        await userAccountService.deleteMyAccount(toUserAccountRequest(req))
        res.status(204).end()
    }
    // Note: Separate endpoint for Admin page
    // public getAccountList(): void {
    //     return
    // }
}