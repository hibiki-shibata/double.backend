import type { ZodObject } from "zod"
import type { NextFunction, Request, Response } from "express";
import { InvalidInput } from "../exception/httpException.js"

export function reqBodyValidation(schema: ZodObject) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)
        if (!result.success) {
            throw new InvalidInput(`Invalid Request Body\n${result.error}`)
        }
        req.body = result.data
        next()
    }
}