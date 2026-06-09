import { logger } from "../../../shared/logger/logger.js"
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
        logger.info("Get account data request arrived")
        const dto: UpdateUserAccountDTO = toUpdateUserAccountDTO(req)
        const user: UserAccountResponse = await userAccountService.getMyAccount(dto)
        logger.info({ statusCode: 200 }, "Account data response dispatched")
        res.status(200).json(user)
    },

    async putUpdatedMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        logger.info("Update account data request arrived")
        const dto: UpdateUserAccountDTO = toUpdateUserAccountDTO(req)
        const updatedUser: UserAccountResponse = await userAccountService.updateMyAccount(dto)
        logger.info("Account data response dispatched")
        res.status(200).json(updatedUser)
    },

    async deleteMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response
    ): Promise<void> {
        logger.info("Delete account data request arrived")
        const dto: UpdateUserAccountDTO = toUpdateUserAccountDTO(req)
        await userAccountService.deleteMyAccount(dto)
        logger.info("Account deletion success response dispatched")
        res.status(204).end()
    }
    // Note: Separate endpoint for Admin page
    // public getAccountList(): void {
    //     return
    // }
}