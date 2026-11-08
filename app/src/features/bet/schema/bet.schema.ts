import z from "zod"
import { BetStatus, Currency } from "@global-shared/infra/db/generated.prisma/enums.js"
import { paginationSchema } from "@global-shared/types/pagination.type.js"

export const BetSchema = {
    response: z.object({
        id: z.uuidv4('bet id must be a uuid4'),
        predictionId: z.uuidv4('prediction id must be a uuid4'),
        betAmount: z.bigint('Bet amount must be more than above'),
        payoutAmount: z.bigint('Payout amount must be more than above'),
        currency: z.enum(Currency),
        status: z.enum(BetStatus),
        createdAt: z.iso.datetime('wrong iso datetime format')
    }),

    cancelRequest: z.object({
        betId: z.uuidv4('bet id must be a uuid4'),
    }),

    createRequest: z.object({
        predictionId: z.uuidv4('prediction id must be a uuid4'),
        betAmount: z.bigint('amount must be bigint of 1 to 100000').min(1n).max(100000n).positive()
    }),

    // Unified query schema for GET /history (supports pagination + optional market filtering)
    getBetHistoryRequestQuery: paginationSchema.extend({
        marketId: z.uuidv4('market id must be a uuid4').optional(),
    }),
}

export type BetResponse = z.infer<typeof BetSchema.response>
export type CancelBetRequest = z.infer<typeof BetSchema.cancelRequest>
export type CreateBetRequest = z.infer<typeof BetSchema.createRequest>
export type GetBetHistoryRequest = z.infer<typeof BetSchema.getBetHistoryRequestQuery>