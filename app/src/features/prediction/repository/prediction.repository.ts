import type { Prediction } from "@global-shared/infra/db/generated.prisma/client.js"

export namespace PredictionRepositoryInput {
    export type GetMany = {
        marketId: string
    }
}

export interface PredictionRepository {
    getMany(dto: PredictionRepositoryInput.GetMany): Promise<Prediction[]>
}