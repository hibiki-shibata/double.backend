import type { DepositRequest, WalletResponse, WalletTransactionResponse, WithdrawRequest } from "../schema/wallet.schema.js"

export interface WalletService {
    getUserWalletInfo(userId: string): Promise<WalletResponse>
    getUserWalletHistory(userId: string, page?: number, limit?: number): Promise<WalletTransactionResponse[]>
    deposit(userId: string, dto: DepositRequest): Promise<WalletResponse>
    withdraw(userId: string, dto: WithdrawRequest): Promise<WalletResponse>
    // registerBankInfo(): Promise<void>
}