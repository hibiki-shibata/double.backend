import type { PrismaClient, WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js";
import type { WalletTransactionRepository, WalletTransactionRepositoryInput } from "./walletTransaction.repository.js";

export class PrismaWalletTransactionRepository implements WalletTransactionRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

    async create(
        dto: WalletTransactionRepositoryInput.Create
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

    async getHistory(dto: WalletTransactionRepositoryInput.GetHistory): Promise<WalletTransaction[]> {
        return await this.db.walletTransaction.findMany({
            where: { wallet_id: dto.walletId },
            skip: dto.paginationInput.offset,
            take: dto.paginationInput.limit,
            orderBy: { created_at: 'desc' }
        })
    }
}