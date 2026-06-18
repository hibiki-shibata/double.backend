import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js"

//  Replace with Zod later
export type GetWalletByUserIdInput = { userId: string }
export type PaginationInput = { offset: number, limit: number }
export type DepositInput = { amount: bigint }
export type WithdrawInput = { amount: bigint }

export interface WalletService {
    getUserWalletInfo(userId: string): Promise<Wallet>
    getUserBalanceHistory(userId: string, pagination: PaginationInput): Promise<WalletTransaction[]>
    deposit(userId: string, dto: DepositInput): Promise<Wallet>
    withdraw(userId: string, dto: WithdrawInput): Promise<Wallet>
    // registerBankInfo(): Promise<void>
}