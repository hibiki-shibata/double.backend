import type { Logger } from 'pino'
import type { Request, Response } from 'express'
import type { UserAccountEditRequest, UserAccountResponse } from "../schema/userAccount.schema.js"
import type { UserAccountService } from '../service/userAccount.service.js'
import type { UserAccountController } from './userAccount.controller.js'
import type { LoggerContext } from '@global-shared/logger/loggerContext.js'

export class UserAccountControllerV1 implements UserAccountController {
    constructor(
        private readonly userAccountService: UserAccountService,
        private readonly loggerContext: LoggerContext
    ) { }

    async getMyAccount(
        req: Request<{}, {}, void>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request account data arrived")
        const user: UserAccountResponse = await this.userAccountService.getAccountInfo(
            req.accessTokenClaim.userId,
        )
        logger.info("Response account data sent")
        res.status(200).json(user)
    }

    async updateMyAccount(
        req: Request<{}, {}, UserAccountEditRequest>,
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request update account data arrived")
        const updatedUser: UserAccountResponse = await this.userAccountService.updateAccount(req.accessTokenClaim.userId, {
            name: req.body.name,
            displayName: req.body.displayName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        })
        logger.info("Response success updated Account data sent")
        res.status(200).json(updatedUser)
    }

    async deleteMyAccount(
        req: Request<{}, {}, void>,
        res: Response
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request delete account data arrived")

        await this.userAccountService.deleteAccount(
            req.accessTokenClaim.userId
        )
        
        logger.info("Response Account deletion success sent")
        res.status(204).end()
    }
}
