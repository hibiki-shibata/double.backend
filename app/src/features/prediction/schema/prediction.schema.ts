import { paginationSchema } from "@global-shared/types/pagination.type.js";
import z from "zod";

export const PredictionSchema = {
    response: z.object({
        id: z.uuidv4('prediction id must be a uuid4'),
        marketId: z.uuidv4('market id must be a uuid4'),
        name: z.string('prediction name must be 1 to 80').min(1).max(80),
        totalParticipants: z.number('total participants must be number'),
        betSum: z.bigint('total participants must be bigint'),
    }),

    getRequestQuery: paginationSchema.extend({
        marketId: z.uuidv4('market id must be a uuid4'),
    })
}

export type PredictionResponse = z.infer<typeof PredictionSchema.response>
export type GetPredictionListRequest = z.infer<typeof PredictionSchema.getRequestQuery>