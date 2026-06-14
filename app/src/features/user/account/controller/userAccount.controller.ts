import type { Request, Response } from 'express'
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import type { UserAccountService } from '../service/userAccount.service.js'
import type { Logger } from 'pino'
import { logger } from '../../../../shared/logger/logger.js'

export class UserAccountController {
    private readonly log: Logger = logger
    constructor(
        private readonly service: UserAccountService,
    ) { }

    async getMyAccount(
        req: Request<{}, {}, void>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Get account data request arrived")
        const user: UserAccountResponse = await this.service.getMyAccount(userId)
        this.log.info({ userId }, "Account data response dispatched")
        res.status(200).json(user)
    }

    async updateMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Update account data request arrived")
        const updatedUser: UserAccountResponse = await this.service.updateMyAccount(userId, req.body)
        this.log.info({ userId }, "Updated Account data response dispatched")
        res.status(200).json(updatedUser)
    }

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Delete account data request arrived")
        await this.service.deleteMyAccount(userId)
        this.log.info({ userId }, "Account deletion success response dispatched")
        res.status(204).end()
    }
}
