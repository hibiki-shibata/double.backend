import z from "zod"
import { BetStatus, Currency } from "@global-shared/infra/db/generated.prisma/enums.js"

export const betSchema = {
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

    getMarketBetRequestParam: z.object({
        marketId: z.uuidv4('bet id must be a uuid4'),
    })
}

export type BetResponse = z.infer<typeof betSchema.response>

export type BetCancelRequest = z.infer<typeof betSchema.cancelRequest>

export type BetCreateRequest = z.infer<typeof betSchema.createRequest>

export type GetMarketBetRequest = z.infer<typeof betSchema.getMarketBetRequestParam>
