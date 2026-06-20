import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js";
import type { createInput, WalletTransactionRepository } from "../walletTransaction/walletTransaction.repository.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

// This may unnecessary
export class CachedWaletTransactionRepository implements WalletTransactionRepository {
    constructor(
        private readonly walletRepository: WalletTransactionRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }
    async create(dto: createInput): Promise<WalletTransaction> {
        const walletTransaction: WalletTransaction = await this.walletRepository.create(dto)
        return walletTransaction
    }

    async getHistoryByWalletId(
        walletId: string,
        paginationInput: PaginationDBInput
    ): Promise<WalletTransaction[]> {
        const cacheKeys: string = this.cacheKeys.walletHistory.byWalletIdAndPagination(walletId, paginationInput)

        const walletHistory: WalletTransaction[] | null = await this.cacheService.getByKey<WalletTransaction[]>(cacheKeys)
        if (walletHistory !== null) return walletHistory

        const dbWalleHistory: WalletTransaction[] = await this.walletRepository.getHistoryByWalletId(walletId, paginationInput)
        await this.cacheService.setByKey(
            cacheKeys,
            dbWalleHistory,
            this.cacheTtlsSec.walletHistory
        )
        return dbWalleHistory
    }
}