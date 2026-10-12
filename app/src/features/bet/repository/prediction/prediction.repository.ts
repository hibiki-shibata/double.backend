import type { Prisma } from "@global-shared/infra/db/generated.prisma/client.js";

export type PredictionWithMarket = Prisma.PredictionGetPayload<{ include: { market: true } }>

export interface PredictionRepository {
    getById(predictionId: string): Promise<PredictionWithMarket>
}