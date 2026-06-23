import type { Bet, BetStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { Pagination } from "@global-shared/types/pagination.type.js";

export type CreateBetInput = {
    marketId: string;
    userId: string;
    predictionId: string;
    betAmount: bigint;
}

export type GetBetByUserIdInput = {
    userId: string
    marketId?: string
    status?: BetStatus;
    pagination: Pagination;
};

export interface BetRepository {
    getById(betId: string): Promise<Bet>
    create(dto: CreateBetInput): Promise<Bet>
    cancelById(betId: string): Promise<Bet>
    getMany(dto: GetBetByUserIdInput): Promise<Bet[]>;
}