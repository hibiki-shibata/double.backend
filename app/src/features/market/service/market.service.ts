import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { MarketGetRequestParams, MarketResponse } from "../schema/market.schema.js";

export interface MarketService {
    getListOfAvailableMarket(pagination: Pagination): Promise<MarketResponse[]>,
    getMarketDetail(dto: MarketGetRequestParams): Promise<MarketResponse>
}