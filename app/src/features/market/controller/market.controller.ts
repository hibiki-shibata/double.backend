import type { Request, Response } from "express"
import type { MarketGetRequestParams, MarketResponse } from "../schema/market.schema.js";

export interface MarketController {
    getOpenMarketList(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<MarketResponse[]>,
    ): Promise<void>
    getMarketDetail(
        req: Request<MarketGetRequestParams, unknown, void>,
        res: Response<MarketResponse>,
    ): Promise<void>
}