import type { PredictionRepository, PredictionRepositoryInput } from "./prediction.repository.js";
import type { Prediction, PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js";

export class PrismaPredictionRepository implements PredictionRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) { }

    async getById(predictionId: string): Promise<Prediction> {
        return await this.prismaClient.prediction.findUniqueOrThrow({
            where: { id: predictionId },
            include: { market: true }
        })
    }

    async getMany(dto: PredictionRepositoryInput.GetMany): Promise<Prediction[]> {
        return await this.prismaClient.prediction.findMany({
            where: { market_id: dto.marketId },
        })
    }
}