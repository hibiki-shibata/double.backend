import type { MarketRepository, MarketWithPredictions } from "../repository/market.repository.js";
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { MarketService } from "./market.service.js";
import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";

export class MarketServiceV1 implements MarketService {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly loggerContext: LoggerContext
    ) { }

    async getListOfAvailableMarket(
        pagination: Pagination,
    ): Promise<MarketResponse[]> {
        const logger = this.loggerContext.getLogger()
        logger.info('Fetching list of available merchants')
        const availableMarkets: MarketWithPredictions[] = await this.marketRepository.getByStatus(MarketStatus.OPEN, {
            offset: pagination.page ? pagination.page - 1 : 0,
            limit: pagination.limit ? pagination.limit : 50
        })
        logger.info('Sucess Fetching list of available merchants')
        return availableMarkets.map((market) => this.toMarketResponse(market))
    }

    async getMarketDetail(dto: MarketGetRequest): Promise<MarketResponse> {
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