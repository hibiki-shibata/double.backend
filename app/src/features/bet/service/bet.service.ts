import type { Pagination } from "@global-shared/types/pagination.type.js"
import type { BetResponse } from "../schema/bet.schema.js"
import type { BetStatus } from "@global-shared/infra/db/generated.prisma/enums.js"

export type CreateBetParams = {
    userId: string,
    predictionId: string,
    betAmount: number,
}

export type CancelBetParams = {
    userId: string,
    bedId: string
}

export type GetUserBetsParamss = {
    userId: string,
    marketId?: string,
    status?: BetStatus,
    paginations: Pagination,
}

export interface BetService {
    create(dto: CreateBetParams): Promise<BetResponse>
    cancel(dto: CancelBetParams): Promise<BetResponse>
    getUserBets(dto: GetUserBetsParamss): Promise<BetResponse[]>
}