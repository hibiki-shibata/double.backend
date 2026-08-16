import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { WalletTransaction } from "@global-shared/infra/db/generated.prisma/client.js";
import type { WalletTransactionRepository, WalletTransactionRepositoryInput } from "../walletTransaction/walletTransaction.repository.js";

// Careful handling on wallet balance data - consider removal later
export class CachedWaletTransactionRepository implements WalletTransactionRepository {
    constructor(
        private readonly walletTransactionRepository: WalletTransactionRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }
    async create(dto: WalletTransactionRepositoryInput.Create): Promise<WalletTransaction> {
        const walletTransaction: WalletTransaction = await this.walletTransactionRepository.create(dto)
        return walletTransaction
    }

    async getMany(
        dto: WalletTransactionRepositoryInput.GetMany
    ): Promise<WalletTransaction[]> {
        const cacheKeys: string = this.cacheKeys.walletHistory.byDto(JSON.stringify(dto))

        const walletHistory: WalletTransaction[] | null = await this.cacheService.getByKey<WalletTransaction[]>(cacheKeys)
        if (walletHistory !== null) return walletHistory

        const dbWalleHistory: WalletTransaction[] = await this.walletTransactionRepository.getMany(dto)
        await this.cacheService.set<WalletTransaction[]>({
            key: cacheKeys,
            value: dbWalleHistory,
            ttlSec: this.cacheTtlsSec.walletHistory
        })
        return dbWalleHistory
    }
}