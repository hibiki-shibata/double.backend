import type { PrismaClient, WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js";
import type { createInput, PaginationInput, WalletTransactionRepository } from "./walletTransaction.repository.js";

export class PrismaWalletTransactionRepository implements WalletTransactionRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

    async create(
        dto: createInput
    ): Promise<WalletTransaction> {
        return await dto.tx.walletTransaction.create({
            data: {
                type: dto.type,
                currency: dto.currency,
                amount: dto.amount,
                balance_after: dto.balanceAfter,
                balance_before: dto.balanceBefore,
                wallet_id: dto.walletId,
                user_id: dto.userId
            }
        })
    }

    async getHistoryByWalletId(walletId: string, pagination: PaginationInput): Promise<WalletTransaction[]> {
        return await this.db.walletTransaction.findMany({
            where: { wallet_id: walletId },
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { created_at: 'desc' }
        })
    }
}