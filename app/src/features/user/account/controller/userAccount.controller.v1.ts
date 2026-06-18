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
        this.log.info({ userId }, "Request account data arrived")
        const user: UserAccountResponse = await this.userAccountService.getAccountInfo(
            req.accessTokenClaim.userId
        )
        this.log.info({ userId }, "Response account data sent")
        res.status(200).json(user)
    }

    async updateMyAccount(
        req: Request<{}, {}, UserAccountRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const userId = req.accessTokenClaim.userId
        this.log.info({ userId }, "Request update account data arrived")
        const updatedUser: UserAccountResponse = await this.userAccountService.updateAccount(userId, {
            name: req.body.name,
            displayName: req.body.displayName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        })
        this.log.info({ userId }, "Response success updated Account data sent")
        res.status(200).json(updatedUser)
    }

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        const userId = req.accessTokenClaim.userId
        this.log.info({ userId }, "Request delete account data arrived")
        await this.userAccountService.deleteAccount(userId)
        this.log.info({ userId }, "Response Account deletion success sent")
        res.status(204).end()
    }
}
