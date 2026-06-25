import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { BetRepository } from "../repository/bet.repository.js";
import type { BetService, BetServiceParams } from "./bet.service.js";
import type { Logger } from "pino";
import type { Bet } from "@global-shared/infra/db/generated.prisma/client.js";
import type { BetResponse } from "../schema/bet.schema.js";

export class BetServiceV1 implements BetService {
    constructor(
        private readonly betRepository: BetRepository,
        private readonly loggerContext: LoggerContext
    ) { }

    async create(dto: BetServiceParams.Create): Promise<BetResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ predictionId: dto.predictionId }, 'creating bet')
        const createdBet: Bet = await this.betRepository.create({
            userId: dto.userId,
            predictionId: dto.predictionId,
            betAmount: dto.betAmount
        })
        logger.info({ betId: createdBet.id }, 'success creating bet')
        return this.toBetResponse(createdBet)
    }

    async cancel(dto: BetServiceParams.Cancel): Promise<BetResponse> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ betId: dto.bedId }, 'cancelling bet')
        const cancelledBet: Bet = await this.betRepository.cancelById(dto.bedId)
        logger.info({ betId: dto.bedId }, 'success cancelling bet')
        return this.toBetResponse(cancelledBet)
    }

    async getUserBetMany(dto: BetServiceParams.GetUserBetMany): Promise<BetResponse[]> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('getting many bets from db')
        const bets: Bet[] = await this.betRepository.getMany({
            userId: dto.userId,
            marketId: dto.marketId ?? null,
            status: dto.status ?? null,
            pagination: {
                offset: (Math.abs(dto.pagination.page) <= 100) ? dto.pagination.page : 0,
                limit: (Math.abs(dto.pagination.limit) <= 50) ? dto.pagination.limit : 30
            }
        })
        logger.info('success getting many bets from db')
        return bets.map((bet) => this.toBetResponse(bet))
    }

    private toBetResponse(bet: Bet): BetResponse {
        return {
            id: bet.id,
            predictionId: bet.prediction_id,
            betAmount: bet.bet_amount,
            payoutAmount: bet.payout_amount,
            currency: bet.currency,
            status: bet.status,
            createdAt: bet.created_at.toISOString(),
        }
    }
}