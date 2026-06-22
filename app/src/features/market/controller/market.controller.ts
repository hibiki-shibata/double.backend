import type { Request, Response } from "express"
import type { MarketGetRequestParams, MarketResponse } from "../schema/market.schema.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";

export interface MarketController {
    getListOfAvailableMarket(
        req: Request<unknown, unknown, void, Pagination>,
        res: Response<MarketResponse[]>,
    ): Promise<void>
    getMarketDetail(
        req: Request<MarketGetRequestParams, void, void>,
        res: Response<MarketResponse>,
    ): Promise<void>
}