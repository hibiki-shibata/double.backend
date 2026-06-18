
import type { PrismaClient, Wallet, WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import type { AddBalanceInput, DeductBalanceInput, GetBalanceHistoryInput, GetByUserIdInput, WalletRepository } from "./wallet.repository.js";

export class PrismaWalletRepository implements WalletRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

    async getByUserId(dto: GetByUserIdInput): Promise<Wallet> {
        return this.db.wallet.findUniqueOrThrow({
            where: { user_id: dto.userId },
        })
    }

    async getBalanceHistory(dto: GetBalanceHistoryInput): Promise<WalletTransaction[]> {
        return await this.db.walletTransaction.findMany({
            where: { wallet_id: dto.walletId },
            skip: dto.offset,
            take: dto.limit
        })
    }

    async addBalance(dto: AddBalanceInput): Promise<Wallet> {
        return dto.tx.wallet.update({
            where: { id: dto.walletId },
            data: {
                balance: { increment: dto.amount }
            },
        })
    }

    async deductBalance(dto: DeductBalanceInput): Promise<Wallet> {
        return dto.tx.wallet.update({
            where: { id: dto.walletId },
            data: {
                balance: { decrement: dto.amount }
            },
        })
    }
}
