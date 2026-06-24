import type { Request, Response } from "express"
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";

export interface MarketController {
    getOpenMarketList(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<MarketResponse[]>,
    ): Promise<void>
    getMarketDetail(
        req: Request<MarketGetRequest, unknown, void>,
        res: Response<MarketResponse>,
    ): Promise<void>
}