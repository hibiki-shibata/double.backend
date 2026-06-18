import type { Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js"
import type { txPrismaClient } from "./walletTransaction.repository.js"

export type GetByUserIdInput = {
    userId: string
}

export type GetBalanceHistoryInput = {
    walletId: string,
    offset: number,
    limit: number
}

export type AddBalanceInput = {
    walletId: string,
    amount: bigint,
    tx: txPrismaClient
}

export type DeductBalanceInput = {
    walletId: string,
    amount: bigint,
    tx: txPrismaClient
}

export interface WalletRepository {
    getByUserId(dto: GetByUserIdInput): Promise<Wallet>
    getBalanceHistory(dto: GetBalanceHistoryInput): Promise<WalletTransaction[]>
    addBalance(dto: AddBalanceInput): Promise<Wallet>
    deductBalance(dto: DeductBalanceInput): Promise<Wallet>
    // registerBankInfo(): Promise<void> // Impelement later
}