import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { MarketResponse } from "../schema/market.schema.js";
import type { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";

export namespace MarketServiceParams {
    export type GetMarketList = {
        marketStatus: MarketStatus[],
        pagination: Pagination
    }

    export type GetMarket = {
        marketId: string
    }
}

export interface MarketService {
    getMarketList(dto: MarketServiceParams.GetMarketList): Promise<MarketResponse[]>,
    getMarketDetail(dto: MarketServiceParams.GetMarket): Promise<MarketResponse>
}