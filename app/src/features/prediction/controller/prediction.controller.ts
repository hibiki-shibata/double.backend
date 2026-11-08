import type { Request, Response } from "express"
import type { PredictionResponse } from "../schema/prediction.schema.js";

export interface PredictionController {
    getPredictions(
        req: Request<unknown, unknown, void, unknown>,
        res: Response<PredictionResponse[]>,
    ): Promise<void>
}