import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { AddBalanceInput, DeductBalanceInput, WalletRepository } from "./wallet.repository.js";
import type { CacheKeys, CacheTtls } from "@global-shared/config/cache.config.js";
import type { Wallet } from "@global-shared/infra/db/generated.prisma/client.js";
import type { txPrismaClient } from "../walletTransaction/walletTransaction.repository.js";

export class CachedWalletRepository implements WalletRepository {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtls: CacheTtls
    ) { }

    async getByUserId(userId: string): Promise<Wallet> {
        const walletCacheKey: string = this.cacheKeys.walletByUserId(userId)
        const userWallet: Wallet | null = await this.cacheService.getByKey<Wallet>(walletCacheKey)
        if (userWallet !== null) return userWallet
        const dbWallet: Wallet = await this.walletRepository.getByUserId(userId)
        await this.cacheService.setByKey<Wallet>(
            walletCacheKey,
            dbWallet,
            this.cacheTtls.walletTtlSecs
        )
        return dbWallet
    }

    async addBalanceByWalletId(walletId: string, tx: txPrismaClient, dto: AddBalanceInput): Promise<Wallet> {
        const dbWallet: Wallet = await this.addBalanceByWalletId(walletId, tx, dto)
        const walletCacheKey: string = this.cacheKeys.walletByUserId(dbWallet.user_id)
        await this.cacheService.deleteByKey(walletCacheKey)
        return dbWallet
    }

    async safeDeductBalanceByWalletId(walletId: string, tx: txPrismaClient, dto: DeductBalanceInput): Promise<Wallet> {
        const dbWallet: Wallet = await this.safeDeductBalanceByWalletId(walletId, tx, dto)
        const walletCacheKey: string = this.cacheKeys.walletByUserId(dbWallet.user_id)
        await this.cacheService.deleteByKey(walletCacheKey)
        return dbWallet
    }
}