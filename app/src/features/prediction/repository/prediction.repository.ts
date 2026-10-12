import type { Prediction } from "@global-shared/infra/db/generated.prisma/client.js"

export namespace PredictionRepositoryInput {
    export type GetMany = {
        marketId: string
    }
}

export interface PredictionRepository {
    getById(predictionId: string): Promise<Prediction>
    getMany(dto: PredictionRepositoryInput.GetMany): Promise<Prediction[]>
}