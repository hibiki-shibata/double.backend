import type { Request, Response } from "express"
import type { BetResponse, CancelBetRequest, CreateBetRequest, GetBetHistoryRequest } from "../schema/bet.schema.js"

export interface BetController {
    createMyBet(
        req: Request<unknown, BetResponse, CreateBetRequest, unknown>,
        res: Response<BetResponse>
    ): Promise<void>
    
    cancelMyBet(
        req: Request<CancelBetRequest, BetResponse, unknown, unknown>,
        res: Response<BetResponse>
    ): Promise<void>
    
    getMyBetHistory(
        req: Request<unknown, BetResponse[], unknown, unknown>,
        res: Response<BetResponse[]>
    ): Promise<void>
}