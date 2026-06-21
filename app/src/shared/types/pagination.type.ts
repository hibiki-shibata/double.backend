import z from "zod"

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(80).default(15).optional(),
})

export type Pagination = z.infer<typeof paginationSchema>

export type PaginationDBInput = {
    offset: number,
    limit: number
}