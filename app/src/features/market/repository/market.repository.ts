import type { MarketStatus, Prisma } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

export type MarketWithPredictions = Prisma.MarketGetPayload<{ include: { predictions: true } }>

export namespace MarketRepositoryInput {
    // Make sure DB repositories when you change this params in the future!!
    export type GetMany = {
        status?: MarketStatus[] | null,
        paginationInput: PaginationDBInput
    }
}

export interface MarketRepository {
    getById(marketId: string): Promise<MarketWithPredictions>
    getMany(dto: MarketRepositoryInput.GetMany): Promise<MarketWithPredictions[]>
}