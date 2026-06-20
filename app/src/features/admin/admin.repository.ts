// import type { Market, MarketStatus, Prediction, PredictionStatus } from "@global-shared/infra/db/generated.prisma/client.js";

// export type PredictionCreateInput = {
//     name: string,
// }

// export type MarketCreateInput = {
//     title: string,
//     closedAt: Date,
//     predictionA: PredictionCreateInput
//     predictionB: PredictionCreateInput
// }

// export type MarketUpdateInput = {
//     title: string,
//     closedAt: Date
// }

// export interface MarketRepository {
//     create(dto: MarketCreateInput): Promise<Market>
//     updateById(marketId: string, dto: MarketUpdateInput): Promise<Market>
//     getById(marketId: string): Promise<Market>
//     getByStatus(status: MarketStatus): Promise<Market[]>
// }


// //  Prediction below

// export type PredictionCreateInput2 = {
//     marketId: string
//     name: string,
// }



// export type PredictionUpdateInput = {
//     name: string,
//     totalPaticipants: number
//     betSum: bigint,
//     status: PredictionStatus
//     resolvedBy: string
//     closedAt: Date
// }

// export interface PredictionRepository {
//     create(dto: PredictionCreateInput): Promise<Prediction>
//     updateById(predictionId: string, dto: PredictionUpdateInput): Promise<Prediction>
// }