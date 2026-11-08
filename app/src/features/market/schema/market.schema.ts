import { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import { paginationSchema } from "@global-shared/types/pagination.type.js";
import z from "zod";

export const MarketSchema = {
    response: z.object({
        id: z.uuidv4('market id must be a uuid4'),
        title: z.string('title must be 1 to 80').min(1).max(80),
        status: z.enum(MarketStatus),
        closeAt: z.iso.datetime('wrong date format'),
        createdAt: z.iso.datetime('wrong date format'),
    }),

    getRequestParam: paginationSchema.extend({
        marketId: z.uuidv4('market id must be a uuid4'),
    })
}

export type MarketResponse = z.infer<typeof MarketSchema.response>
export type unknownGetMarketRequest = z.infer<typeof MarketSchema.getRequestParam>