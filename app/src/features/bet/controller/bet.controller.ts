import type { Request, Response } from "express"

export interface BetController {
    createMyBet(req: Request, res: Response): Promise<void>
    cancelMyBet(req: Request, res: Response): Promise<void>
    getMyBetByMarketId(req: Request, res: Response): Promise<void>
    getMyBetHistory(req: Request, res: Response): Promise<void>
}