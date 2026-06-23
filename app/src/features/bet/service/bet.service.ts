import type { Pagination } from "@global-shared/types/pagination.type.js"
import type { BetResponse } from "../schema/bet.schema.js"
import type { BetStatus } from "@global-shared/infra/db/generated.prisma/enums.js"

export namespace BetServiceParams {
    export type Create = {
        userId: string,
        predictionId: string,
        betAmount: number,
    }

    export type Cancel = {
        userId: string,
        bedId: string
    }

    export type GetUserBetMany = {
        userId: string,
        marketId?: string,
        status?: BetStatus,
        paginations: Pagination,
    }

    // export type GetByUserIdAndStatus = {
    //     userId: string,
    //     status: BetStatus,
    //     paginations: Pagination,
    // }

    // export type GetByUserIdAndMarketId = {
    //     userId: string,
    //     marketId: string
    //     paginations: Pagination,
    // }

}

export interface BetService {
    create(dto: BetServiceParams.Create): Promise<BetResponse>
    cancel(dto: BetServiceParams.Cancel): Promise<BetResponse>
    getUserBetMany(dto: BetServiceParams.GetUserBetMany): Promise<BetResponse>
    // getByUserIdAndMarketId(dto: BetServiceParams.GetByUserIdAndMarketId): Promise<BetResponse[]>
    // getbyUserIdAndStatus(dto: BetServiceParams.GetByUserIdAndStatus): Promise<BetResponse[]>
}