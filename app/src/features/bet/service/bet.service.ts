import type { BetCancelRequest, BetCreateRequest, BetResponse } from "../schema/bet.schema.js"

export interface BetService {
    createBet(userId: string, dto: BetCreateRequest): Promise<BetResponse>
    updateBet(userId: string, dto: BetCancelRequest): Promise<BetResponse>
}