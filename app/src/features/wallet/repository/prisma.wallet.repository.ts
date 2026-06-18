import type { PrismaClient, Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import type { WalletRepository } from "./wallet.repository.js";

export class PrismaWalletRepository implements WalletRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

    async getByUserId(userId: string): Promise<Wallet> {
        return this.db.wallet.findUniqueOrThrow({
            where: { user_id: userId },
        })
    }

    async getBalanceHistory(
        walletId: string, offset: number, limit: number
    ): Promise<WalletTransaction[]> {
        return await this.db.walletTransaction.findMany({
            where: { wallet_id: walletId },
            skip: offset,
            take: limit
        })
    }

    async update(walletId: string, balance: bigint): Promise<Wallet> {
        return await this.db.wallet.update({
            where: { id: walletId },
            data: {
                balance: balance,
                version: { increment: 1 }
            },
        })
    }
}
