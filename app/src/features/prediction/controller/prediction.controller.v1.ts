import type { Request, Response } from "express";
import type { Logger } from "pino";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { PredictionController } from "./prediction.controller.js";
import type { PredictionService } from "../service/prediction.service.js";
import type { GetPredictionRequest, PredictionResponse } from "../schema/prediction.schema.js";

export class PredictionControllerV1 implements PredictionController {
    constructor(
        private readonly PredictionService: PredictionService,
        private readonly loggerContext: LoggerContext
    ) { }

    async getPredictions(
        req: Request<GetPredictionRequest, unknown, void, unknown>,
        res: Response<PredictionResponse[]>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        logger.info('Request to get Prediction arrived')
        const availablePredictions: PredictionResponse[] = await this.PredictionService.getPredictionsByMarketId({
            marketId: req.params.marketId
        })
        res.status(200).json(availablePredictions)
        logger.info('Response sucess get list of Prediction sent')
    }
}