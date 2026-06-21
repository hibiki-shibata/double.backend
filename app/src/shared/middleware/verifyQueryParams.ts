import { InvalidInputErr } from "@global-shared/error/httpErrors.js"
import type { Request, Response, NextFunction } from "express"
import type { ZodObject } from "zod"

export function verifyQueryParams(schema: ZodObject) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)
        if (!result.success) {
            throw new InvalidInputErr(`Invalid query params: ${result.error.message}`)
        }

        req.query = result.data as typeof req.query
        next()
    }
}