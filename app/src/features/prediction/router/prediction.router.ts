import { Router } from "express";
import type { PredictionController } from "../controller/prediction.controller.js";
import { validateRequest } from "@global-shared/middleware/validateRequest.js";
import { PredictionSchema } from "../schema/prediction.schema.js";
import { authenticate } from "@global-shared/middleware/authenticate.js";
import { authorize } from "@global-shared/middleware/authorize.js";
import { UserRoles } from "@global-shared/infra/db/generated.prisma/enums.js";

export const PREDICTION_ROUTES = {
    GET_BY_MARKET_ID: '/', // Query
} as const;

export function predictionRouter(
    controller: PredictionController
): Router {
    const router = Router();

    router.get(
        PREDICTION_ROUTES.GET_BY_MARKET_ID,
        authenticate,
        authorize({ requiredRoles: [UserRoles.USER] }),
        validateRequest({ query: PredictionSchema.getRequestQuery }),
        controller.getPredictions
    );

    return router;
}