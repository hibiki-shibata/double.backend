import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { BetRepository, BetRepositoryInput } from "./bet.repository.js";
import type { Bet } from "@global-shared/infra/db/generated.prisma/client.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";

export class CachedBetRepository implements BetRepository {
    constructor(
        private readonly betRepository: BetRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }

    async create(dto: BetRepositoryInput.Create): Promise<Bet> {
        return await this.betRepository.create(dto)
    }

    async updateById(betId: string, dto: BetRepositoryInput.Update): Promise<Bet> {
        const dbBet: Bet = await this.betRepository.updateById(betId, dto)
        const walletCacheKey: string = this.cacheKeys.bet.byId(betId)
        await this.cacheService.deleteByKey(walletCacheKey)
        return dbBet
    }

    async getById(betId: string): Promise<Bet> {
        const cacheKey: string = this.cacheKeys.bet.byId(betId)
        const cachedBet: Bet | null = await this.cacheService.getByKey<Bet>(cacheKey)
        if (cachedBet !== null) return cachedBet
        const dbBet: Bet = await this.betRepository.getById(betId)
        await this.cacheService.set<Bet>({
            key: cacheKey,
            value: dbBet,
            ttlSec: this.cacheTtlsSec.bet
        })
        return dbBet
    }

    async getMany(dto: BetRepositoryInput.GetMany): Promise<Bet[]> {
        const cacheKey: string = this.cacheKeys.betHistory.byDto(JSON.stringify(dto))
        const cachedBet: Bet[] | null = await this.cacheService.getByKey<Bet[]>(cacheKey)
        if (cachedBet !== null) return cachedBet
        const betHistory: Bet[] = await this.betRepository.getMany(dto)
        await this.cacheService.set<Bet[]>({
            key: cacheKey,
            value: betHistory,
            ttlSec: this.cacheTtlsSec.betHistory
        })
        return betHistory
    }
}