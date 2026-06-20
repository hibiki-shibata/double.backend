import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import z from "zod";

export const marketResponseSchema = z.object({
    id: z.uuidv4('market id must be a uuid4'),
    title: z.string('title must be 1 to 80').min(1).max(80),
    status: z.enum(MarketStatus),
    closedAt: z.date('wrong date format'),
    resolvedAt: z.iso.datetime('wrong date format'),
    createdAt: z.iso.datetime('wrong date format'),
    prediction: z.array(z.object({
        name: z.string().min(1).max(80)
    }))
})
export type MarketResponse = z.infer<typeof marketResponseSchema>


export const marketRequestSchema = z.object({
    id: z.uuidv4('market id must be a uuid4'),
})
export type MarketRequest = z.infer<typeof marketRequestSchema>
