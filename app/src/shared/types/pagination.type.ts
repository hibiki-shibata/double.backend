import z from "zod"

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).max(100).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(30),
})

export type Pagination = z.infer<typeof paginationSchema>

export type PaginationDBInput = {
    offset: number,
    limit: number
}