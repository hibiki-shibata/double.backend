import type { Wallet, WalletStatus } from "@global-shared/infra/db/generated.prisma/client.js"
import type { txPrismaClient } from "../walletTransaction/walletTransaction.repository.js"

export namespace WalletRepositoryInput {
    export type SafeDepositBalance = {
        amount: bigint,
        walletId: string,
        allowedWalletStatus: WalletStatus[],
        tx: txPrismaClient
    }

    export type SafeWithdrawBalance = {
        amount: bigint,
        walletId: string,
        allowedWalletStatus: WalletStatus[],
        tx: txPrismaClient
    }
}

export interface WalletRepository {
    getByUserId(userId: string): Promise<Wallet>
    safeDepositBalance(dto: WalletRepositoryInput.SafeDepositBalance): Promise<Wallet>
    safeWithdrawBalance(dto: WalletRepositoryInput.SafeWithdrawBalance): Promise<Wallet>
    // registerBankInfo(): Promise<void> // Impelement later
}