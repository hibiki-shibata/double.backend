
import type { PrismaClient, Wallet } from "../../../shared/infra/db/generated.prisma/client.js";
import type { AddBalanceInput, DeductBalanceInput, WalletRepository } from "./wallet.repository.js";
import type { txPrismaClient } from "./walletTransaction.repository.js";

export class PrismaWalletRepository implements WalletRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

    async getByUserId(userId: string): Promise<Wallet> {
        return this.db.wallet.findUniqueOrThrow({
            where: { user_id: userId },
        })
    }

    async addBalanceByWalletId(walletId: string, tx: txPrismaClient, dto: AddBalanceInput): Promise<Wallet> {
        return tx.wallet.update({
            where: { id: walletId },
            data: {
                balance: { increment: dto.amount }
            },
        })
    }

    async safeDeductBalanceByWalletId(walletId: string, tx: txPrismaClient, dto: DeductBalanceInput): Promise<Wallet> {
        return tx.wallet.update({
            where: {
                id: walletId,
                balance: { gte: dto.amount }
            },
            data: {
                balance: { decrement: dto.amount }
            },
        })
    }
}
