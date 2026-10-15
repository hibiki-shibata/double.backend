import type { Pagination } from "@global-shared/types/pagination.type.js"
import type { BetResponse } from "../schema/bet.schema.js"
import type { BetStatus } from "@global-shared/infra/db/generated.prisma/enums.js"

export namespace BetServiceArgs {
    export type Create = {
        userId: string,
        predictionId: string,
        betAmount: bigint,
    }

    export type Cancel = {
        bedId: string
    }

    export type GetUserBetMany = {
        userId: string,
        marketId?: string,
        status?: BetStatus[],
        pagination: Pagination,
    }
}

export interface BetService {
    create(dto: BetServiceArgs.Create): Promise<BetResponse>
    cancel(dto: BetServiceArgs.Cancel): Promise<BetResponse>
    getUserBetMany(dto: BetServiceArgs.GetUserBetMany): Promise<BetResponse[]>
}