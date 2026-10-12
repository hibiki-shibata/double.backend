import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { MarketResponse } from "../schema/market.schema.js";
import type { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";

export namespace MarketServiceArgs {
    export type GetMarketsByStatus = {
        marketStatus: MarketStatus[],
        pagination: Pagination
    }

    export type GetMarket = {
        marketId: string
    }
}

export interface MarketService {
    getMarketsByStatus(dto: MarketServiceArgs.GetMarketsByStatus): Promise<MarketResponse[]>,
    getMarketDetail(dto: MarketServiceArgs.GetMarket): Promise<MarketResponse>
}