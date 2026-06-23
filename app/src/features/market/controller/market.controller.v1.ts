import type { Request, Response } from "express";
import type { Logger } from "pino";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { MarketController } from "./market.controller.js";
import type { MarketService } from "../service/market.service.js";
import type { MarketGetRequestParams, MarketResponse } from "../schema/market.schema.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";
import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";

export class MarketControllerV1 implements MarketController {
    constructor(
        private readonly marketService: MarketService,
        private readonly loggerContext: LoggerContext
    ) { }

    async getOpenMarketList(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<MarketResponse[]>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request to get list of market arrived')
        const availableMarkets: MarketResponse[] = await this.marketService.getMarketList({
            marketStatus: [MarketStatus.OPEN],
            pagination: req.query as Pagination
        })
        res.status(200).json(availableMarkets)
        logger.info('Response sucess get list of market sent')
    }

    async getMarketDetail(
        req: Request<MarketGetRequestParams, unknown, void>,
        res: Response<MarketResponse>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request to get market detail arrived')
        const marketId: string = req.params.marketId
        const marketDetail: MarketResponse = await this.marketService.getMarketDetail({
            marketId: marketId
        })
        res.status(200).json(marketDetail)
        logger.info('Response success get market detail sent')
    }
}