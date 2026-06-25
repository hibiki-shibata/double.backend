import type { Bet, BetStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

export namespace BetRepositoryInput {
    export type Create = {
        userId: string
        predictionId: string
        betAmount: bigint
    }

    export type Update = {
        status: BetStatus
    }

    // Make sure DB repositories when you change this params in the future!!
    export type GetMany = {
        userId: string
        marketId?: string | null
        status?: BetStatus[] | null
        pagination: PaginationDBInput;
    }
}

export interface BetRepository {
    create(dto: BetRepositoryInput.Create): Promise<Bet>
    updateById(betId: string, dto: BetRepositoryInput.Update): Promise<Bet>
    getById(betId: string): Promise<Bet>
    getMany(dto: BetRepositoryInput.GetMany): Promise<Bet[]>
}