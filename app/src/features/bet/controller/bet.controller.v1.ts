import type { Request, Response } from "express"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { BetService } from "../service/bet.service.js";
import type { BetController } from "./bet.controller.js";
import type { Logger } from "pino";
import type { BetCancelRequest, BetCreateRequest, BetResponse, MarketBetRequest } from "../schema/bet.schema.js";
import type { AccessTokenClaim } from "@global-shared/auth/type/jwtToken.type.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";

export class BetControllerV1 implements BetController {
    constructor(
        private readonly betService: BetService,
        private readonly loggerContext: LoggerContext
    ) { }

    async createMyBet(
        req: Request<unknown, unknown, BetCreateRequest> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request create bet arrived')
        const createdBet: BetResponse = await this.betService.create({
            userId: req.accessTokenClaim.userName,
            predictionId: req.body.predictionId,
            betAmount: req.body.betAmount,
        })
        res.status(200).json(createdBet)
        logger.info({ betId: createdBet.id }, 'Response success create bet sent')
    }

    async cancelMyBet(
        req: Request<unknown, unknown, BetCancelRequest> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ betId: req.body.betId }, 'Request cancel bet arrived')
        const cancelledBet: BetResponse = await this.betService.cancel({
            bedId: req.body.betId,
        })
        res.status(200).json(cancelledBet)
        logger.info({ betId: req.body.betId }, 'Response success cancel bet sent')
    }

    async getMyMarketBets(
        req: Request<MarketBetRequest, unknown, void, unknown> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse[]>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info({ marketId: req.params.marketId }, 'Request get my market bet arrived')
        const marketBets: BetResponse[] = await this.betService.getUserBetMany({
            userId: req.accessTokenClaim.userName,
            marketId: req.params.marketId,
            pagination: req.query as Pagination
        })
        res.status(200).json(marketBets)
        logger.info('Response success get my market bet sent')
    }

    async getMyBetHistory(
        req: Request<unknown, unknown, void, unknown> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse[]>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request get my best history arrived')
        const betHistory: BetResponse[] = await this.betService.getUserBetMany({
            userId: req.accessTokenClaim.userName,
            pagination: req.query as Pagination
        })
        res.status(200).json(betHistory)
        logger.info('Response success get my best history sent')
    }

}