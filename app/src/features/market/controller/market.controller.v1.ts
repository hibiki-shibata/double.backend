import type { Request, Response } from "express";
import type { Logger } from "pino";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { MarketController } from "./market.controller.js";
import type { MarketService } from "../service/market.service.js";
import type { GetMarketRequest, MarketResponse } from "../schema/market.schema.js";
import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";

export class MarketControllerV1 implements MarketController {
    constructor(
        private readonly marketService: MarketService,
        private readonly loggerContext: LoggerContext
    ) {
        // Bind methods so they can be passed directly to Express routers safely
        this.getOpenMarketList = this.getOpenMarketList.bind(this);
        this.getMarketDetail = this.getMarketDetail.bind(this);
    }

    async getOpenMarketList(
        req: Request<unknown, unknown, void, Pagination>,
        res: Response<MarketResponse[]>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger();
        logger.info('Request to get list of market arrived');

        const availableMarkets: MarketResponse[] = await this.marketService.getMarketsByStatus({
            marketStatus: [MarketStatus.UPCOMING, MarketStatus.OPEN],
            pagination: req.query
        });

        res.status(200).json(availableMarkets);
        logger.info('Response success get list of market sent');
    }

    async getMarketDetail(
        req: Request<GetMarketRequest, unknown, void, unknown>,
        res: Response<MarketResponse>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger();
        const marketId: string = req.params.marketId;

        logger.info({ marketId }, 'Request to get market detail arrived');

        const marketDetail: MarketResponse = await this.marketService.getMarketDetail({
            marketId: marketId
        })

        res.status(200).json(marketDetail);
        logger.info('Response success get market detail sent');
    }
}