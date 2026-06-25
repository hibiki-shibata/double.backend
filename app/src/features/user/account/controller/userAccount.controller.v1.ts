import type { Logger } from 'pino'
import type { Request, Response } from 'express'
import type { UserAccountEditRequest, UserAccountResponse } from "../schema/userAccount.schema.js"
import type { UserAccountService } from '../service/userAccount.service.js'
import type { UserAccountController } from './userAccount.controller.js'
import type { LoggerContext } from '@global-shared/logger/loggerContext.js'
import type { AccessTokenClaim } from '@global-shared/auth/type/jwtToken.type.js'

export class UserAccountControllerV1 implements UserAccountController {
    constructor(
        private readonly userAccountService: UserAccountService,
        private readonly loggerContext: LoggerContext,
    ) { }

    async getMyAccount(
        req: Request<unknown, unknown, unknown> & { accessTokenClaim: AccessTokenClaim },
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request account data arrived")
        const user: UserAccountResponse = await this.userAccountService.getAccountDetail({
            userId: req.accessTokenClaim.userId

        })
        res.status(200).json(user)
        logger.info("Response account data sent")
    }

    async updateMyAccount(
        req: Request<unknown, unknown, UserAccountEditRequest> & { accessTokenClaim: AccessTokenClaim },
        res: Response<UserAccountResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request update account data arrived")
        const updatedUser: UserAccountResponse = await this.userAccountService.updateAccountDetail({
            userId: req.accessTokenClaim.userId,
            name: req.body.name,
            displayName: req.body.displayName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        })
        res.status(200).json(updatedUser)
        logger.info("Response success updated Account data sent")
    }

    async deleteMyAccount(
        req: Request<unknown, unknown, void> & { accessTokenClaim: AccessTokenClaim },
        res: Response<void>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info("Request delete account data arrived")

        await this.userAccountService.deleteAccount({
            userId: req.accessTokenClaim.userId
        })

        res.status(204).end()
        logger.info("Response Account deletion success sent")
    }
}
