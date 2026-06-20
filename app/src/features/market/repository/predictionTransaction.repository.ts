import type { PredictionTransaction, PredictionTransactionType } from "@global-shared/infra/db/generated.prisma/client.js"
import type { Pagination } from "@global-shared/types/pagination.type.js"

export type PredictionTxCreateInput = {
    type: PredictionTransactionType
    amount: bigint,
    totalParticipantsBefore: number,
    totalParticipantsAfter: number,
    betSumBefore: bigint,
    betSumAfter: bigint,
}

export interface PredictionTransactionRepository {
    create(dto: PredictionTxCreateInput): Promise<PredictionTransaction>
    getByPredictionId(predictionId: string, pagination: Pagination): Promise<PredictionTransaction>
}
