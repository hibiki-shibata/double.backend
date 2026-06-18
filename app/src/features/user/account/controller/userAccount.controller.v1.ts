import type { Logger } from 'pino'
import type { Request, Response } from 'express'
import type { UserAccountRequest, UserAccountResponse } from "../dto/userAccount.dto.js"
import type { UserAccountService } from '../service/userAccount.service.js'
import type { UserAccountController } from './userAccount.controller.js'

export class UserAccountControllerV1 implements UserAccountController {
    constructor(
        private readonly userAccountService: UserAccountService,
        private readonly log: Logger
    ) { }

    async getMyAccount(
        req: Request<{}, {}, void>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const userId = req.accessTokenClaim.userId
        this.log.info({ userId }, "Get account data request arrived")
        const user: UserAccountResponse = await this.userAccountService.getAccountInfo(
            req.accessTokenClaim.userId
        )
        this.log.info({ userId }, "Account data response dispatched")
        res.status(200).json(user)
    }

    async updateMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const userId = req.accessTokenClaim.userId
        this.log.info({ userId }, "Update account data request arrived")
        const updatedUser: UserAccountResponse = await this.userAccountService.updateAccount(userId, {
            name: req.body.name,
            displayName: req.body.displayName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        })
        this.log.info({ userId }, "Updated Account data response dispatched")
        res.status(200).json(updatedUser)
    }

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        const userId = req.accessTokenClaim.userId
        this.log.info({ userId }, "Delete account data request arrived")
        await this.userAccountService.deleteAccount(userId)
        this.log.info({ userId }, "Account deletion success response dispatched")
        res.status(204).end()
    }
}
