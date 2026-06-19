import z from "zod"

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(80).default(15),
})

export type Pagination = z.infer<typeof paginationSchema>