// @global-shared/middleware/validateRequest.ts
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { InvalidInputErr } from "@global-shared/error/httpErrors.js";

export interface RequestValidationSchema {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

export function validateRequest(schemas: RequestValidationSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        // 1. Validate URL Params
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                return next(
                    new InvalidInputErr(`Invalid path parameters: ${result.error.message}`)
                );
            }
            req.params = result.data as typeof req.params;
        }

        // 2. Validate Query Parameters
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                return next(
                    new InvalidInputErr(`Invalid query parameters: ${result.error.message}`)
                );
            }
            req.query = result.data as typeof req.query;
        }

        // 3. Validate Request Body
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                return next(
                    new InvalidInputErr(`Invalid request body: ${result.error.message}`)
                );
            }
            req.body = result.data;
        }

        next();
    };
}