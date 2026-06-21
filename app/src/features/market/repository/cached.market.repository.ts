import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { MarketRepository, MarketWithPredictions } from "./market.repository.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";


export class CachedMarketRepository implements MarketRepository {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtls: CacheTtlsSec
    ) { }

    async getById(marketId: string): Promise<MarketWithPredictions> {
        const cacheKey: string = this.cacheKeys.market.byId(marketId)
        const cachedMarket: MarketWithPredictions | null = await this.cacheService.getByKey<MarketWithPredictions>(cacheKey)
        if (cachedMarket !== null) return cachedMarket
        const dbMarket: MarketWithPredictions = await this.marketRepository.getById(marketId)
        await this.cacheService.setByKey(
            cacheKey,
            dbMarket,
            this.cacheTtls.market
        )
        return dbMarket
    }

    async getByStatus(status: MarketStatus, pagination: PaginationDBInput): Promise<MarketWithPredictions[]> {
        const cacheKey: string = this.cacheKeys.marketsByStatus.byPagination(pagination)
        const cachedMarket: MarketWithPredictions[] | null = await this.cacheService.getByKey<MarketWithPredictions[]>(cacheKey)
        if (cachedMarket !== null) return cachedMarket
        const dbMarkets: MarketWithPredictions[] = await this.marketRepository.getByStatus(status, pagination)
        await this.cacheService.setByKey(
            cacheKey,
            dbMarkets,
            this.cacheTtls.marketsByStatus
        )
        return dbMarkets
    }
}