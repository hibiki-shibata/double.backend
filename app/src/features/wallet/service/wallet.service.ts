import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js"

//  Replace with Zod later
export type GetWalletByUserIdInput = { userId: string }
export type GetUserBalanceHistory = { userId: string, offset: number, limit: number }
export type Deposit = { userId: string, amount: bigint }
export type Withdraw = { userId: string, amount: bigint }

export interface WalletService {
    getWalletByUserId(dto: GetWalletByUserIdInput): Promise<Wallet>
    getUserBalanceHistory(dto: GetUserBalanceHistory): Promise<WalletTransaction[]>
    deposit(dto: Deposit): Promise<Wallet>
    withdraw(dto: Withdraw): Promise<Wallet>
    // registerBankInfo(): Promise<void>
    // updateBankInfo(): Promise<void>
    // deleteBankInfo(): Promise<void>
}