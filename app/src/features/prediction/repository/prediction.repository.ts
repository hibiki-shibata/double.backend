import type { Prediction } from "@global-shared/infra/db/generated.prisma/client.js"

export namespace PredictionRepositoryInput {
    export type GetManyByMarketId = {
        marketId: string
    }
}

export interface PredictionRepository {
    getById(predictionId: string): Promise<Prediction>
    getManyByMarketId(dto: PredictionRepositoryInput.GetManyByMarketId): Promise<Prediction[]>
}