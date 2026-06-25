import type { MarketRepository, MarketWithPredictions } from "../repository/market.repository.js";
import type { MarketService, MarketServiceParams } from "./market.service.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { MarketResponse } from "../schema/market.schema.js";

export class MarketServiceV1 implements MarketService {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly loggerContext: LoggerContext
    ) { }

    async getMarketList(
        dto: MarketServiceParams.GetMarketList
    ): Promise<MarketResponse[]> {
        const logger = this.loggerContext.getLogger()
        logger.info('Fetching list of available merchants')
        const openMarkets: MarketWithPredictions[] = await this.marketRepository.getMany({
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
        dto: MarketServiceParams.GetMarket
    ): Promise<MarketResponse> {
        const logger = this.loggerContext.getLogger()
        logger.info({ marketId: dto.marketId }, 'Fetching market details')
        const market: MarketWithPredictions = await this.marketRepository.getById(dto.marketId)
        logger.info({ marketId: dto.marketId }, 'Success Fetching market details')
        return this.toMarketResponse(market)
    }

    private toMarketResponse(data: MarketWithPredictions): MarketResponse {
        return {
            id: data.id,
            title: data.title,
            status: data.status,
            closeAt: data.close_at.toISOString(),
            createdAt: data.created_at.toISOString(),
            predictions: data.predictions.map((prediction) => ({
                name: prediction.name,
                totalParticipants: prediction.total_participants,
                betSum: prediction.bet_sum,
            }))
        }
    }
}