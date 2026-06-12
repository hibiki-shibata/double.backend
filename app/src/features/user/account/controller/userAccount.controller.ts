import { logger } from "../../../../shared/logger/logger.js"
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import { userAccountService } from "../service/userAccount.service.js"
import type { Request, Response } from 'express'

// Implement zod
export const UserAccountController = {

    async getMyAccount(
        req: Request<{}, {}, void>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        logger.info("Get account data request arrived")
        const user: UserAccountResponse = await userAccountService.getMyAccount(req.accessTokenClaim.userId)
        logger.info("Account data response dispatched")
        res.status(200).json(user)
    },

    async updateMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        logger.info("Update account data request arrived")
        const updatedUser: UserAccountResponse = await userAccountService.updateMyAccount(req.accessTokenClaim.userId, req.body)
        logger.info("Updated Account data response dispatched")
        res.status(200).json(updatedUser)
    },

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        logger.info("Delete account data request arrived")
        await userAccountService.deleteMyAccount(req.accessTokenClaim.userId)
        logger.info("Account deletion success response dispatched")
        res.status(204).end()
    }
    // Note: Separate endpoint for Admin page
    // public getAccountList(): void {
    //     return
    // }
}