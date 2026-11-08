import type { PredictionResponse } from "../schema/prediction.schema.js";

export namespace PredictionServiceArgs {
    export type getPredictionsByMarketId = {
        marketId: string
    }
}

export interface PredictionService {
    getList(dto: PredictionServiceArgs.getPredictionsByMarketId): Promise<PredictionResponse[]>,
}