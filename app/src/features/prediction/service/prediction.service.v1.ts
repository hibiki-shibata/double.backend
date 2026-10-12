import type { PredictionRepository } from "../repository/prediction.repository.js";
import type { PredictionService, PredictionServiceArgs } from "./prediction.service.js";
import type { LoggerContext } from "@global-shared/logger/loggerContext.js";
import type { PredictionResponse } from "../schema/prediction.schema.js";
import type { Prediction } from "@global-shared/infra/db/generated.prisma/client.js";

export class PredictionServiceV1 implements PredictionService {
    constructor(
        private readonly PredictionRepository: PredictionRepository,
        private readonly loggerContext: LoggerContext
    ) { }

    async getPredictionsByMarketId(
        dto: PredictionServiceArgs.getPredictionsByMarketId
    ): Promise<PredictionResponse[]> {
        const logger = this.loggerContext.getLogger()
        logger.info('Fetching Predictions by marketId')
        const predictions: Prediction[] = await this.PredictionRepository.getMany({
            marketId: dto.marketId
        })
        logger.info('Sucess Fetching list of available merchants')
        return predictions.map((predictions) => this.toPredictionResponse(predictions))
    }

    private toPredictionResponse(data: Prediction): PredictionResponse {
        return {
            name: data.name,
            totalParticipants: data.total_participants,
            betSum: data.bet_sum,
        }
    }
}