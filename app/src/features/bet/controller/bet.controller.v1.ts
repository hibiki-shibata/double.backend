import type { Request, Response } from "express"
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { BetService } from "../service/bet.service.js";
import type { BetController } from "./bet.controller.js";
import type { Logger } from "pino";
import type { CancelBetRequest, CreateBetRequest, BetResponse, GetBetHistoryRequest } from "../schema/bet.schema.js";
import type { AccessTokenClaim } from "@global-shared/auth/type/jwtToken.type.js";

export class BetControllerV1 implements BetController {
    constructor(
        private readonly betService: BetService,
        private readonly loggerContext: LoggerContext
    ) { }

    async createMyBet(
        req: Request<unknown, BetResponse, CreateBetRequest, unknown> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request create bet arrived')

        const createdBet: BetResponse = await this.betService.create({
            userId: req.accessTokenClaim.userName,
            predictionId: req.body.predictionId,
            betAmount: req.body.betAmount,
        })

        res.status(201).json(createdBet)
        logger.info({ betId: createdBet.id }, 'Response success create bet sent')
    }

    async cancelMyBet(
        req: Request<CancelBetRequest, BetResponse, unknown, unknown> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        const { betId } = req.params;

        logger.info({ betId }, 'Request cancel bet arrived')

        const cancelledBet: BetResponse = await this.betService.cancel({
            betId: betId,
        })

        res.status(200).json(cancelledBet)
        logger.info({ betId }, 'Response success cancel bet sent')
    }

    async getMyBetHistory(
        req: Request<unknown, BetResponse[], unknown, GetBetHistoryRequest> & { accessTokenClaim: AccessTokenClaim },
        res: Response<BetResponse[]>
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request get my bet history arrived')

        const { page, limit, marketId } = req.query;

        const betHistory: BetResponse[] = await this.betService.getUserBetMany({
            userId: req.accessTokenClaim.userName,
            pagination: { page, limit },
            ...(marketId ? { marketId } : {}),
        })

        res.status(200).json(betHistory)
        logger.info('Response success get my bet history sent')
    }
}