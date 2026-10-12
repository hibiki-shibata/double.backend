import type { Market, MarketStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

// export type MarketWithPredictions = Prisma.MarketGetPayload<{ include: { predictions: true } }>

export namespace MarketRepositoryInput {
    export type GetMany = {
        status?: MarketStatus[] | null,
        paginationInput: PaginationDBInput
    }
}

export interface MarketRepository {
    getById(marketId: string): Promise<Market>
    getMany(dto: MarketRepositoryInput.GetMany): Promise<Market[]>
}