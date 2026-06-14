import type { ZodObject } from "zod"
import type { NextFunction, Request, Response } from "express";
import { InvalidInputErr } from "../error/httpErrors.js"

export function validateRequestBody(schema: ZodObject) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            throw new InvalidInputErr(`Invalid Request Body\n${result.error}`)
        }
        req.body = result.data
        next()
    }
}