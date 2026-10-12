import type { Bet, BetStatus } from "@global-shared/infra/db/generated.prisma/client.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

// export type BetWithPrediction = Prisma.BetGetPayload<{ include: { prediction: true } }>

export namespace BetRepositoryInput {
    export type SafeCreate = {
        userId: string
        predictionId: string
        betAmount: bigint
    }

    export type Update = {
        status: BetStatus
    }
    
    export type GetMany = {
        userId: string
        marketId?: string | null
        status?: BetStatus[] | null
        pagination: PaginationDBInput;
    }
}

export interface BetRepository {
    create(dto: BetRepositoryInput.SafeCreate): Promise<Bet>
    updateById(betId: string, dto: BetRepositoryInput.Update): Promise<Bet>
    getById(betId: string): Promise<Bet>
    getMany(dto: BetRepositoryInput.GetMany): Promise<Bet[]>
}