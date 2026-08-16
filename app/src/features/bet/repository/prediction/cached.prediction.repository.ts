import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { PredictionRepository, PredictionWithMarket } from "./prediction.repository.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";

export class CachedPredictionRepository implements PredictionRepository {
    constructor(
        private readonly dbRepository: PredictionRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlSec: CacheTtlsSec
    ) { }

    async getById(predictionId: string): Promise<PredictionWithMarket> {
        const cacheKey: string = this.cacheKeys.prediction.byId(predictionId)
        const cachedPrediction: PredictionWithMarket | null = await this.cacheService.getByKey<PredictionWithMarket>(cacheKey)
        if (cachedPrediction) return cachedPrediction
        const dbPrediction: PredictionWithMarket = await this.dbRepository.getById(predictionId)
        await this.cacheService.set<PredictionWithMarket>({
            key: cacheKey,
            value: dbPrediction,
            ttlSec: this.cacheTtlSec.prediction
        })
        return dbPrediction
    }
}