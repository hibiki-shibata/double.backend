import type { Logger } from "pino";
import type { Request, Response } from "express";
import type { WalletController } from "./wallet.controller.js";
import type { WalletService } from "../service/wallet.service.js";
import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { AccessTokenClaim } from "@global-shared/auth/type/jwtToken.type.js";

export class WalletControllerV1 implements WalletController {
    constructor(
        private readonly walletService: WalletService,
        private readonly loggerContext: LoggerContext
    ) { }
    async getMyWalletInfo(
        req: Request<unknown, unknown, void> & { accessTokenClaim: AccessTokenClaim },
        res: Response<WalletResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request get my walletinfo arrived')
        const walletInfo: WalletResponse = await this.walletService.getUserWalletInfo(req.accessTokenClaim.userId)
        logger.info('Response success get my walletinfo sent')
        res.status(200).json(walletInfo)
    }

    async getMyWalletHistory(
        req: Request<unknown, unknown, void, Pagination> & { accessTokenClaim: AccessTokenClaim },
        res: Response<WalletTransactionResponse[]>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()

        logger.info('Request get my wallet history arrived')
        const walletHistory: WalletTransactionResponse[] = await this.walletService.getUserWalletHistory(
            req.accessTokenClaim.userId,
            req.query
        )
        logger.info('Response success get my wallet history sent')
        res.status(200).json(walletHistory)
    }

    async deposit(
        req: Request<unknown, unknown, DepositRequest> & { accessTokenClaim: AccessTokenClaim },
        res: Response<WalletResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request deposit arrived')
        const walletInfo: WalletResponse = await this.walletService.deposit(req.accessTokenClaim.userId, {
            amount: req.body.amount
        })
        logger.info('Response success deposit sent')
        res.status(200).json(walletInfo)
    }

    async withdraw(req: Request<unknown, unknown, WithdrawRequest> & { accessTokenClaim: AccessTokenClaim },
        res: Response<WalletResponse>): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request withdraw arrived')
        const walletInfo: WalletResponse = await this.walletService.withdraw(req.accessTokenClaim.userId, {
            amount: req.body.amount
        })
        logger.info('Response success withdraw sent')
        res.status(200).json(walletInfo)
    }
}