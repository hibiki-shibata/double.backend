import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import z from "zod";

export const marketResponseSchema = z.object({
    id: z.uuidv4('market id must be a uuid4'),
    title: z.string('title must be 1 to 80').min(1).max(80),
    status: z.enum(MarketStatus),
    closeAt: z.iso.datetime('wrong date format'),
    createdAt: z.iso.datetime('wrong date format'),
    predictions: z.array(z.object({
        name: z.string('prediction name must be 1 to 80').min(1).max(80),
        totalParticipants: z.number('total participants must be number'),
        betSum: z.bigint('total participants must be bigint'),
    }))
})
export type MarketResponse = z.infer<typeof marketResponseSchema>


export const marketGetRequestParamsSchema = z.object({
    marketId: z.uuidv4('market id must be a uuid4'),
})
export type MarketGetRequest = z.infer<typeof marketGetRequestParamsSchema>