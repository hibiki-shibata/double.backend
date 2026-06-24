import type { MarketStatus, Prisma } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

export type MarketWithPredictions = Prisma.MarketGetPayload<{ include: { predictions: true } }>

export interface MarketRepository {
    getById(marketId: string): Promise<MarketWithPredictions>
    getByStatus(status: MarketStatus[], pagination: PaginationDBInput): Promise<MarketWithPredictions[]>
}