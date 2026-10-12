import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { MarketRepository, MarketRepositoryInput } from "./market.repository.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { Market } from "@global-shared/infra/db/generated.prisma/client.js";

export class CachedMarketRepository implements MarketRepository {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }

    async getById(marketId: string): Promise<Market> {
        const cacheKey: string = this.cacheKeys.market.byId(marketId)
        const cachedMarket: Market | null = await this.cacheService.getByKey<Market>(cacheKey)
        if (cachedMarket !== null) return cachedMarket
        const dbMarket: Market = await this.marketRepository.getById(marketId)
        await this.cacheService.set<Market>({
            key: cacheKey,
            value: dbMarket,
            ttlSec: this.cacheTtlsSec.market
        })
        return dbMarket
    }

    async getMany(dto: MarketRepositoryInput.GetMany): Promise<Market[]> {
        const cacheKey: string = this.cacheKeys.marketList.byPagination(dto.paginationInput)
        const cachedMarket: Market[] | null = await this.cacheService.getByKey<Market[]>(cacheKey)
        if (cachedMarket !== null) return cachedMarket
        const dbMarkets: Market[] = await this.marketRepository.getMany(dto)
        await this.cacheService.set<Market[]>({
            key: cacheKey,
            value: dbMarkets,
            ttlSec: this.cacheTtlsSec.marketList
        })
        return dbMarkets
    }
}