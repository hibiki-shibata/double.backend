import type { Request, Response } from "express";
import type { MarketResponse } from "../schema/market.schema.js";

export interface MarketController {
    getOpenMarketList(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<MarketResponse[]>,
    ): Promise<void>
    getMarketDetail(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<MarketResponse>,
    ): Promise<void>
}