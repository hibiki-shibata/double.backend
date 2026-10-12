import type { Request, Response } from "express"
import type { GetPredictionRequest, PredictionResponse } from "../schema/prediction.schema.js";

export interface PredictionController {
    getPredictions(
        req: Request<GetPredictionRequest, unknown, void, unknown>,
        res: Response<PredictionResponse[]>,
    ): Promise<void>
}