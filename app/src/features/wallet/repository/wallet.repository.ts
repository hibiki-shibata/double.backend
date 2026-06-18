import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js"

export interface WalletRepository {
    getByUserId(userId: string): Promise<Wallet>
    getBalanceHistory(walletId: string, offset: number, limit: number): Promise<WalletTransaction[]>
    update(walletId: string, amount: bigint): Promise<Wallet>
    // registerBankInfo(): Promise<void> // Impelement later
    // updateBankInfo(): Promise<void>
    // deleteBankInfo(): Promise<void>
}