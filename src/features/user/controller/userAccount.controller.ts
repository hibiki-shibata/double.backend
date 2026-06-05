import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"
import { UserAccountSerivce } from "../service/userAccount.service.js"
import type { Request, Response } from 'express'

// Delete later
const exampleDto: UserAccountRequest = {
    id: 'string',
    name: 'string',
    display_name: 'string',
    email_address: 'string',
}

// Implement zod
export const UserAccountController = {

    async getMyAccountData(
        _req: Request,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const user: UserAccountResponse
            = await UserAccountSerivce.getMyAccount('userId')
        res.status(200).json(user)
    },

    async putUpdatedMyAccount(
        _req: Request<UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const updatedUser: UserAccountResponse
            = await UserAccountSerivce.updateMyAccount(exampleDto)
        res.status(200).json(updatedUser)
    },

    async deleteMyAccount(
        _req: Request,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        await UserAccountSerivce.deleteMyAccount('userId')
        res.status(200)
    }
    // Note: Separate endpoint for Admin page
    // public getAccountList(): void {
    //     return
    // }
}