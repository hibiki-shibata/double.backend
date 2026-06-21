import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";

export interface MarketService {
    getListOfAvailableMarket(pagination: Pagination): Promise<MarketResponse[]>,
    getMarketDetail(dto: MarketGetRequest): Promise<MarketResponse>
}