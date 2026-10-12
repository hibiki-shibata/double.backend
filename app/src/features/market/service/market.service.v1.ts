import type { MarketRepository } from "../repository/market.repository.js";
import type { MarketService, MarketServiceArgs } from "./market.service.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { MarketResponse } from "../schema/market.schema.js";
import type { Market } from "@global-shared/infra/db/generated.prisma/client.js";

export class MarketServiceV1 implements MarketService {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly loggerContext: LoggerContext
    ) { }

    async getMarketsByStatus(
        dto: MarketServiceArgs.GetMarketsByStatus
    ): Promise<MarketResponse[]> {
        const logger = this.loggerContext.getLogger()
        logger.info('Fetching list of available merchants')
        const openMarkets: Market[] = await this.marketRepository.getMany({
            status: dto.marketStatus,
            paginationInput: {
                offset: (Math.abs(dto.pagination.page) <= 100) ? dto.pagination.page : 0,
                limit: (Math.abs(dto.pagination.limit) <= 50) ? dto.pagination.limit : 30
            }
        })
        logger.info('Sucess Fetching list of available merchants')
        return openMarkets.map((market) => this.toMarketResponse(market))
    }

    async getMarketDetail(
        dto: MarketServiceArgs.GetMarket
    ): Promise<MarketResponse> {
        const logger = this.loggerContext.getLogger()
        logger.info({ marketId: dto.marketId }, 'Fetching market details')
        const market: Market = await this.marketRepository.getById(dto.marketId)
        logger.info({ marketId: dto.marketId }, 'Success Fetching market details')
        return this.toMarketResponse(market)
    }

    private toMarketResponse(data: Market): MarketResponse {
        return {
            id: data.id,
            title: data.title,
            status: data.status,
            closeAt: data.close_at.toISOString(),
            createdAt: data.created_at.toISOString(),
            // predictions: data.predictions.map((prediction) => ({
            //     name: prediction.name,
            //     totalParticipants: prediction.total_participants,
            //     betSum: prediction.bet_sum,
            // }))
        }
    }
}