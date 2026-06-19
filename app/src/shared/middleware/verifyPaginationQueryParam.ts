import type { Request, Response, NextFunction } from "express"
import { InvalidInputErr } from "../error/httpErrors.js"
import { paginationSchema } from "@global-shared/types/pagination.type.js"

export function verifyPaginationQuery() {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = paginationSchema.safeParse({
            page: req.query.page,
            limit: req.query.limit,
        })

        if (!result.success) {
            throw new InvalidInputErr(`Invalid pagination query: ${result.error.message}`)
        }

        req.pagination = {
            page: result.data.page,
            limit: result.data.limit,
        }
        next()
    }
}