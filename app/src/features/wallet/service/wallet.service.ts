import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js"

export interface WalletService {
    getWalletByUserId(userId: string): Promise<Wallet>
    getUserBalanceHistory(userId: string, offset: number, limit: number): Promise<WalletTransaction[]>
    deposit(userId: string, amount: bigint): Promise<Wallet>
    withdraw(userId: string, amount: bigint): Promise<Wallet>
    // registerBankInfo(): Promise<void>
    // updateBankInfo(): Promise<void>
    // deleteBankInfo(): Promise<void>
}