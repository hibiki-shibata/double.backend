import type { Request, Response } from "express"
import type { BetCancelRequest, BetCreateRequest, BetResponse, MarketBetRequest } from "../schema/bet.schema.js"

export interface BetController {
    createMyBet(
        req: Request<unknown, unknown, BetCreateRequest>,
        res: Response<BetResponse>
    ): Promise<void>
    cancelMyBet(
        req: Request<unknown, unknown, BetCancelRequest>,
        res: Response<BetResponse>
    ): Promise<void>
    getMyMarketBets(
        req: Request<MarketBetRequest, unknown, void, unknown>,
        res: Response<BetResponse>
    ): Promise<void>
    getMyBetHistory(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<BetResponse>
    ): Promise<void>
}