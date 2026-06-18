import type { WalletTransaction } from "../../../shared/infra/db/generated.prisma/client.js";
import type { createInput, WalletTransactionRepository } from "./walletTransaction.repository.js";

export class PrismaWalletTransactionRepository implements WalletTransactionRepository {
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
}