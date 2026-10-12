import type { PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PredictionRepository, PredictionWithMarket } from "./prediction.repository.js";


export class PrismaPredictionRepository implements PredictionRepository {
    constructor(
        private readonly prismaClient: PrismaClient,
    ) { }

    async getById(predictionId: string): Promise<PredictionWithMarket> {
        return await this.prismaClient.prediction.findUniqueOrThrow({
            where: { id: predictionId },
            include: { market: true }
        })
    }
}