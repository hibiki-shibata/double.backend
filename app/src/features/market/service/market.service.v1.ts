import type { Pagination } from "@global-shared/types/pagination.type.js";
import type { MarketRepository, MarketWithPredictions } from "../repository/market.repository.js";
import type { MarketService } from "./market.service.js";
import type { MarketGetRequest, MarketResponse } from "../schema/market.schema.js";
import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import type { Logger } from "pino";

export class MarketServiceV1 implements MarketService {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly log: Logger
    ) { }

    async getListOfAvailableMarket(pagination: Pagination): Promise<MarketResponse[]> {
        this.log.info('Fetching list of available merchants')
        const availableMarkets: MarketWithPredictions[] = await this.marketRepository.getByStatus(MarketStatus.OPEN, {
            offset: pagination.page - 1,
            limit: pagination.limit
        })
        this.log.info('Sucess Fetching list of available merchants')
        return availableMarkets.map((market) => this.toMarketResponse(market))
    }

    async getMarketDetail(dto: MarketGetRequest): Promise<MarketResponse> {
        this.log.info({ marketId: dto.marketId }, 'Fetching market details')
        const market: MarketWithPredictions = await this.marketRepository.getById(dto.marketId)
        this.log.info({ marketId: dto.marketId }, 'Success Fetching market details')
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