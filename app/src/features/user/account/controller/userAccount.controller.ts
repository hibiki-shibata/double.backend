import type { Request, Response } from 'express'
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import type { UserAccountService } from '../service/userAccount.service.js'
import { logger } from '../../../../shared/logger/logger.js'

export class UserAccountController {
    constructor(
        private readonly service: UserAccountService
    ) { }

    async getMyAccount(
        req: Request<{}, {}, void>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        logger.info("Get account data request arrived")
        const user: UserAccountResponse = await this.service.getMyAccount(req.accessTokenClaim.userId)
        logger.info("Account data response dispatched")
        res.status(200).json(user)
    }

    async updateMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        logger.info("Update account data request arrived")
        const updatedUser: UserAccountResponse = await this.service.updateMyAccount(req.accessTokenClaim.userId, req.body)
        logger.info("Updated Account data response dispatched")
        res.status(200).json(updatedUser)
    }

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        logger.info("Delete account data request arrived")
        await this.service.deleteMyAccount(req.accessTokenClaim.userId)
        logger.info("Account deletion success response dispatched")
        res.status(204).end()
    }
}
