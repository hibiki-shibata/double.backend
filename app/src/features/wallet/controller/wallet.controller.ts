import type { Request, Response } from "express"
import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js"

export interface WalletController {
    getMyWalletInfo(
        req: Request<unknown, unknown, void>,
        res: Response<WalletResponse>
    ): Promise<void>
    getMyWalletHistory(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<WalletTransactionResponse[]>
    ): Promise<void>
    deposit(
        req: Request<unknown, unknown, DepositRequest>,
        res: Response<WalletResponse>
    ): Promise<void>
    withdraw(
        req: Request<unknown, unknown, WithdrawRequest>,
        res: Response<WalletResponse>
    ): Promise<void>
}