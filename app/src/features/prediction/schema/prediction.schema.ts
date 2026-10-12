import z from "zod";

export const PredictionSchema = {
    // response: z.array(z.object({
    //     name: z.string('prediction name must be 1 to 80').min(1).max(80),
    //     totalParticipants: z.number('total participants must be number'),
    //     betSum: z.bigint('total participants must be bigint'),
    // })),
    response: z.object({
        name: z.string('prediction name must be 1 to 80').min(1).max(80),
        totalParticipants: z.number('total participants must be number'),
        betSum: z.bigint('total participants must be bigint'),
    }),

    getRequestParam: z.object({
        marketId: z.uuidv4('market id must be a uuid4'),
    })
}

export type PredictionResponse = z.infer<typeof PredictionSchema.response>

export type GetPredictionRequest = z.infer<typeof PredictionSchema.getRequestParam>