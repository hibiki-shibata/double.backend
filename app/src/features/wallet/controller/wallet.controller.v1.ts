import type { Logger } from "pino";
import type { Request, Response } from "express";
import type { WalletController } from "./wallet.controller.js";
import type { WalletService } from "../service/wallet.service.js";
import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js";

export class WalletControllerV1 implements WalletController {
    constructor(
        private readonly walletService: WalletService,
        private readonly log: Logger
    ) { }
    async getMyWalletInfo(req: Request<{}, {}, void>, res: Response<WalletResponse>): Promise<void> {
        const userId: string = req.accessTokenClaim.userId
        this.log.info({ userId }, 'Request get my walletinfo arrived')
        const walletInfo: WalletResponse = await this.walletService.getUserWalletInfo(userId)
        this.log.info({ userId }, 'Response success get my walletinfo sent')
        res.status(200).json(walletInfo)
    }

    async getMyWalletHistory(req: Request<{}, {}, void>, res: Response<WalletTransactionResponse[]>): Promise<void> {
        const userId: string = req.accessTokenClaim.userId
        this.log.info({ userId }, 'Request get my wallet history arrived')
        const walletHistory: WalletTransactionResponse[] = await this.walletService.getUserWalletHistory(
            userId,
            req.pagination.page,
            req.pagination.limit
        )
        this.log.info({ userId }, 'Response success get my wallet history sent')
        res.status(200).json(walletHistory)
    }

    async deposit(req: Request<{}, {}, DepositRequest>, res: Response<WalletResponse>): Promise<void> {
        const userId: string = req.accessTokenClaim.userId
        this.log.info({ userId }, 'Request deposit arrived')
        const walletInfo: WalletResponse = await this.walletService.deposit(userId, {
            amount: req.body.amount
        })
        this.log.info({ userId }, 'Response success deposit sent')
        res.status(200).json(walletInfo)
    }

    async withdraw(req: Request<{}, {}, WithdrawRequest>, res: Response<WalletResponse>): Promise<void> {
        const userId: string = req.accessTokenClaim.userId
        this.log.info({ userId }, 'Request withdraw arrived')
        const walletInfo: WalletResponse = await this.walletService.withdraw(userId, {
            amount: req.body.amount
        })
        this.log.info({ userId }, 'Response success withdraw sent')
        res.status(200).json(walletInfo)
    }
}