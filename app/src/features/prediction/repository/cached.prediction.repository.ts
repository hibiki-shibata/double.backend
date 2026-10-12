import type { CacheService } from "@global-shared/infra/cache/service/cache.service.js";
import type { PredictionRepository, PredictionRepositoryInput } from "./prediction.repository.js";
import type { CacheKeys, CacheTtlsSec } from "@global-shared/config/cache.config.js";
import type { Prediction } from "@global-shared/infra/db/generated.prisma/client.js";

export class CachedPredictionRepository implements PredictionRepository {
    constructor(
        private readonly PredictionRepository: PredictionRepository,
        private readonly cacheService: CacheService,
        private readonly cacheKeys: CacheKeys,
        private readonly cacheTtlsSec: CacheTtlsSec
    ) { }


    async getMany(dto: PredictionRepositoryInput.GetMany): Promise<Prediction[]> {
        const cacheKey: string = this.cacheKeys.predictions.byMarketId(dto.marketId)
        const cachedPrediction: Prediction[] | null = await this.cacheService.getByKey<Prediction[]>(cacheKey)
        if (cachedPrediction !== null) return cachedPrediction
        const dbPredictions: Prediction[] = await this.PredictionRepository.getMany(dto)
        await this.cacheService.set<Prediction[]>({
            key: cacheKey,
            value: dbPredictions,
            ttlSec: this.cacheTtlsSec.prediction
        })
        return dbPredictions
    }
}