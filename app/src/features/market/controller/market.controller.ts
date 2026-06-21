import type { Request, Response } from "express"
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";

export interface MarketController {
    getListOfAvailableMarket(req: Request, res: Response<MarketResponse[]>): Promise<void>
    getMarketDetail(req: Request<{ marketId: string }, {}, MarketGetRequest>, res: Response): Promise<void>
}