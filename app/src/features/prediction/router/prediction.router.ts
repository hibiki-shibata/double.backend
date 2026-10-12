import { Router } from "express";
import type { PredictionController } from "../controller/prediction.controller.js";

export function predictionRouter(
    controller: PredictionController
): Router {
    const router: Router = Router()
    router.get(
        '/:marketId',
        controller.getPredictions
    )
    return router
}