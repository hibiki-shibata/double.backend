import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js";
import type { createInput, WalletTransactionRepository } from "../walletTransaction/walletTransaction.repository.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

// Careful handling on wallet balance data - consider removal later
export class CachedWaletTransactionRepository implements WalletTransactionRepository {
    constructor(
        private readonly walletTransactionRepository: WalletTransactionRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }
    async create(dto: createInput): Promise<WalletTransaction> {
        const walletTransaction: WalletTransaction = await this.walletTransactionRepository.create(dto)
        return walletTransaction
    }

    async getHistoryByWalletId(
        walletId: string,
        paginationInput: PaginationDBInput
    ): Promise<WalletTransaction[]> {
        const cacheKeys: string = this.cacheKeys.walletHistory.byWalletIdAndPagination(walletId, paginationInput)

        const walletHistory: WalletTransaction[] | null = await this.cacheService.getByKey<WalletTransaction[]>(cacheKeys)
        if (walletHistory !== null) return walletHistory

        const dbWalleHistory: WalletTransaction[] = await this.walletTransactionRepository.getHistoryByWalletId(walletId, paginationInput)
        await this.cacheService.setByKey<WalletTransaction[]>(
            cacheKeys,
            dbWalleHistory,
            this.cacheTtlsSec.walletHistory
        )
        return dbWalleHistory
    }
}