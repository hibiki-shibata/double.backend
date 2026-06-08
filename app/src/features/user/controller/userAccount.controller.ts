import type { UpdateUserAccountDTO, UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import { toUpdateUserAccountDTO } from "../mapper/userAccount.mapper.js"
import { userAccountService } from "../service/userAccount.service.js"
import type { Request, Response } from 'express'

// Implement zod
export const UserAccountController = {

    async getMyAccountData(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const dto: UpdateUserAccountDTO = toUpdateUserAccountDTO(req)
        const user: UserAccountResponse = await userAccountService.getMyAccount(dto)
        res.status(200).json(user)
    },

    async putUpdatedMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const dto: UpdateUserAccountDTO = toUpdateUserAccountDTO(req)
        const updatedUser: UserAccountResponse = await userAccountService.updateMyAccount(dto)
        res.status(200).json(updatedUser)
    },

    async deleteMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response
    ): Promise<void> {
        const dto: UpdateUserAccountDTO = toUpdateUserAccountDTO(req)
        await userAccountService.deleteMyAccount(dto)
        res.status(204).end()
    }
    // Note: Separate endpoint for Admin page
    // public getAccountList(): void {
    //     return
    // }
}