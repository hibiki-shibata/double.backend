import type { Logger } from "pino";
import type { Request, Response } from "express";
import type { MarketController } from "./market.controller.js";
import type { MarketService } from "../service/market.service.js";
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";

export class MarketControllerV1 implements MarketController {
    constructor(
        private readonly marketService: MarketService,
        private readonly log: Logger
    ) { }

    async getListOfAvailableMarket(req: Request, res: Response<MarketResponse[]>): Promise<void> {
        this.log.info('Request to get list of market arrived')
        const availableMarkets: MarketResponse[] = await this.marketService.getListOfAvailableMarket(req.pagination)
        this.log.info('Response sucess get list of market sent')
        res.status(200).json(availableMarkets)
    }
    async getMarketDetail(req: Request<{ marketId: string }, {}, MarketGetRequest>, res: Response): Promise<void> {
        const marketId: string = req.params.marketId
        this.log.info('Request to get market detail arrived')
        const marketDetail: MarketResponse = await this.marketService.getMarketDetail({ marketId: marketId })
        this.log.info('Response success get market detail sent')
        res.status(200).json(marketDetail)
    }
}