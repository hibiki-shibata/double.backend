import z from "zod"
import { BetStatus, Currency } from "@global-shared/infra/db/generated.prisma/enums.js"

export const betResponseSchema = z.object({
    id: z.uuidv4('bet id must be a uuid4'),
    predictionId: z.uuidv4('prediction id must be a uuid4'),
    betAmount: z.bigint('Bet amount must be more than above'),
    payoutAmount: z.bigint('Payout amount must be more than above'),
    currency: z.enum(Currency),
    status: z.enum(BetStatus),
    createdAt: z.iso.datetime('wrong iso datetime format')
})
export type BetResponse = z.infer<typeof betResponseSchema>


export const betCreateRequestSchema = z.object({
    predictionId: z.uuidv4('prediction id must be a uuid4'),
    betAmount: z.bigint('amount must be bigint of 1 to 100000').min(1n).max(100000n).positive()
})
export type BetCreateRequest = z.infer<typeof betCreateRequestSchema>


export const betCancelRequestSchema = z.object({
    betId: z.uuidv4('bet id must be a uuid4'),
})
export type BetCancelRequest = z.infer<typeof betCancelRequestSchema>

// export interface BetController {
//     bet(req: Request, res: Response): Promise<void>
//     cancelMyBet(req: Request, res: Response): Promise<void>
//     getMyBetByPredictionId(req: Request, res: Response): Promise<void>
//     getMyBetHistory(req: Request, res: Response): Promise<void>
// }