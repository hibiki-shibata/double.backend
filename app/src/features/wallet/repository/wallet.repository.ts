import type { Wallet } from "../../../shared/infra/db/generated.prisma/client.js"
import type { txPrismaClient } from "./walletTransaction.repository.js"

export type GetByUserIdInput = {
    userId: string
}

export type AddBalanceInput = {
    amount: bigint,
}

export type DeductBalanceInput = {
    amount: bigint,
}

export interface WalletRepository {
    getByUserId(userId: string): Promise<Wallet>
    addBalanceByWalletId(walletId: string, tx: txPrismaClient, dto: AddBalanceInput): Promise<Wallet>
    safeDeductBalanceByWalletId(walletId: string, tx: txPrismaClient, dto: DeductBalanceInput): Promise<Wallet>
    // registerBankInfo(): Promise<void> // Impelement later
}