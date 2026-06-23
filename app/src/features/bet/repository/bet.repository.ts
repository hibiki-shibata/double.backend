import type { Bet, BetStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";


export namespace BetRepositoryInputs {
    export type CreateBet = {
        marketId: string;
        userId: string;
        predictionId: string;
        betAmount: bigint;
    }

    export type GetMany = {
        userId: string
        marketId?: string
        status?: BetStatus;
        pagination: PaginationDBInput;
    }
}

export interface BetRepository {
    getById(betId: string): Promise<Bet>
    create(dto: BetRepositoryInputs.CreateBet): Promise<Bet>
    cancelById(betId: string): Promise<Bet>
    getMany(dto: BetRepositoryInputs.GetMany): Promise<Bet[]>;
}