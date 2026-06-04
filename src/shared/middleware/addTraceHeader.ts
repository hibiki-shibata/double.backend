import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';

export function addTraceHeader(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const requestId: string = (req.headers['x-request-id'] as string) ?? uuidv4()
    req.requestId = requestId
    res.setHeader('x-request-id', requestId)
    next()
}