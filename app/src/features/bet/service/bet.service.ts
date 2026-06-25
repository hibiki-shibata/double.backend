import type { Pagination } from "@global-shared/types/pagination.type.js"
import type { BetResponse } from "../schema/bet.schema.js"
import type { BetStatus } from "@global-shared/infra/db/generated.prisma/enums.js"

export namespace BetServiceParams {
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
    create(dto: BetServiceParams.Create): Promise<BetResponse>
    cancel(dto: BetServiceParams.Cancel): Promise<BetResponse>
    getUserBetMany(dto: BetServiceParams.GetUserBetMany): Promise<BetResponse[]>
}