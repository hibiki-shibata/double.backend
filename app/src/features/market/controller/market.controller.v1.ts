import type { Request, Response } from "express";
import type { Logger } from "pino";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { MarketController } from "./market.controller.js";
import type { MarketService } from "../service/market.service.js";
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";

export class MarketControllerV1 implements MarketController {
    constructor(
        private readonly marketService: MarketService,
        private readonly loggerContext: LoggerContext
    ) { }

    async getListOfAvailableMarket(
        req: Request,
        res: Response<MarketResponse[]>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request to get list of market arrived')
        const availableMarkets: MarketResponse[] = await this.marketService.getListOfAvailableMarket(req.pagination)
        res.status(200).json(availableMarkets)
        logger.info('Response sucess get list of market sent')
    }

    async getMarketDetail(
        req: Request<{ marketId: string }, {}, MarketGetRequest>,
        res: Response,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request to get market detail arrived')
        const marketId: string = req.params.marketId
        const marketDetail: MarketResponse = await this.marketService.getMarketDetail({ marketId: marketId })
        res.status(200).json(marketDetail)
        logger.info('Response success get market detail sent')
    }
}