import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { Wallet } from "@global-shared/infra/db/generated.prisma/client.js";
import type { WalletRepository, WalletRepositoryInput } from "./wallet.repository.js";

// This may unnecessary
export class CachedWalletRepository implements WalletRepository {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtls: CacheTtlsSec
    ) { }

    async getByUserId(userId: string): Promise<Wallet> {
        const walletCacheKey: string = this.cacheKeys.wallet.byUserId(userId)
        const userWallet: Wallet | null = await this.cacheService.getByKey<Wallet>(walletCacheKey)
        if (userWallet !== null) return userWallet
        const dbWallet: Wallet = await this.walletRepository.getByUserId(userId)
        await this.cacheService.set<Wallet>({
            key: walletCacheKey,
            value: dbWallet,
            ttlSec: this.cacheTtls.wallet
        })
        return dbWallet
    }

    async safeDepositBalance(dto: WalletRepositoryInput.SafeDepositBalance): Promise<Wallet> {
        const dbWallet: Wallet = await this.walletRepository.safeDepositBalance({
            amount: dto.amount,
            walletId: dto.walletId,
            tx: dto.tx,
        })
        const walletCacheKey: string = this.cacheKeys.wallet.byUserId(dbWallet.user_id)
        await this.cacheService.deleteByKey(walletCacheKey)
        return dbWallet
    }

    async safeWithdrawBalance(dto: WalletRepositoryInput.SafeWithdrawBalance): Promise<Wallet> {
        const dbWallet: Wallet = await this.walletRepository.safeWithdrawBalance({
            amount: dto.amount,
            walletId: dto.walletId,
            tx: dto.tx,
        })
        const walletCacheKey: string = this.cacheKeys.wallet.byUserId(dbWallet.user_id)
        await this.cacheService.deleteByKey(walletCacheKey)
        return dbWallet
    }
}