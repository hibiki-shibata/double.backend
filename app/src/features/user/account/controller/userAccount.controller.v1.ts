import type { Logger } from 'pino'
import type { Request, Response } from 'express'
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import type { UserAccountService } from '../service/userAccount.service.js'
import type { UserAccountController } from './userAccount.controller.js'

export class UserAccountControllerV1 implements UserAccountController {
    constructor(
        private readonly service: UserAccountService,
        private readonly log: Logger
    ) { }

    async getMyAccount(
        req: Request<{}, {}, void>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Get account data request arrived")
        const user: UserAccountResponse = await this.service.getAccountInfo(userId)
        this.log.info({ userId }, "Account data response dispatched")
        res.status(200).json(user)
    }

    async updateMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Update account data request arrived")
        const updatedUser: UserAccountResponse = await this.service.updateAccount(userId, req.body)
        this.log.info({ userId }, "Updated Account data response dispatched")
        res.status(200).json(updatedUser)
    }

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        const { userId } = req.accessTokenClaim
        this.log.info({ userId }, "Delete account data request arrived")
        await this.service.deleteAccount(userId)
        this.log.info({ userId }, "Account deletion success response dispatched")
        res.status(204).end()
    }
}
