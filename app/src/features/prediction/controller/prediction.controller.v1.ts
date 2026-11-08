import type { Request, Response } from "express";
import type { Logger } from "pino";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { PredictionController } from "./prediction.controller.js";
import type { PredictionService } from "../service/prediction.service.js";
import type { GetPredictionListRequest, PredictionResponse } from "../schema/prediction.schema.js";

export class PredictionControllerV1 implements PredictionController {
    constructor(
        private readonly PredictionService: PredictionService,
        private readonly loggerContext: LoggerContext
    ) { }

    async getPredictions(
        req: Request<unknown, unknown, void, GetPredictionListRequest>,
        res: Response<PredictionResponse[]>,
    ): Promise<void> {
        const logger: Logger = this.loggerContext.getLogger()
        const { marketId } = req.query

        logger.info({ marketId }, 'Request to get Prediction arrived')

        const availablePredictions: PredictionResponse[] = await this.PredictionService.getList({
            marketId: marketId
        })

        res.status(200).json(availablePredictions)
        logger.info('Response sucess get list of Prediction sent')
    }
}