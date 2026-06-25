import type { Bet, BetStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

export namespace BetRepositoryInput {
    export type CreateBet = {
        userId: string;
        predictionId: string;
        betAmount: bigint;
    }

    export type GetMany = {
        userId: string
        marketId: string | null
        status: BetStatus[] | null
        pagination: PaginationDBInput;
    }
}

export interface BetRepository {
    create(dto: BetRepositoryInput.CreateBet): Promise<Bet>
    getMany(dto: BetRepositoryInput.GetMany): Promise<Bet[]>
    getById(betId: string): Promise<Bet>
    cancelById(betId: string): Promise<Bet>
}