import type { Request, Response } from "express"
import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js"

export interface WalletController {
    getMyWalletInfo(req: Request<{}, {}, void>, res: Response<WalletResponse>): Promise<void>
    getMyWalletHistory(req: Request<{}, {}, void>, res: Response<WalletTransactionResponse[]>): Promise<void>
    deposit(req: Request<{}, {}, DepositRequest>, res: Response<WalletResponse>): Promise<void>
    withdraw(req: Request<{}, {}, WithdrawRequest>, res: Response<WalletResponse>): Promise<void>
}