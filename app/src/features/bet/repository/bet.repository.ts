import type { Bet, BetStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";

export type BetCreateInput = {
    userId: string,
    marketId: string,
    predictionId: string,
    betAmount: bigint,
    payoutAmount: bigint,
}

export type BetUpdateInput = {
    betAmount: bigint,
    payoutAmount: bigint,
    status: BetStatus
}

export type BetGetbyUserIdAndMarketInput = {
    userId: string,
    marketId: string
}

export interface BetRepository {
    create(dto: BetCreateInput): Promise<Bet>
    updateById(betId: string, dto: BetUpdateInput): Promise<Bet>
    getById(betId: string): Promise<Bet>
    getByUserId(userId: string, pagination: Pagination): Promise<Bet[]>
    getByUserIdAndMarketId(dto: BetGetbyUserIdAndMarketInput): Promise<Bet[]>
}