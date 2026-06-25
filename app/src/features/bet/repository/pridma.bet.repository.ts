// import type { Bet, Prisma, PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js";
// import type { BetRepository, BetRepositoryInputs } from "./bet.repository.js";

// export class PrismaBetRepository implements BetRepository {
//     constructor(
//         private readonly prismaClient: PrismaClient
//     ) { }

//     async create(dto: BetRepositoryInputs.CreateBet): Promise<Bet> {
//         const data: Prisma.BetCreateInput = {
//             bet_amount: dto.betAmount,
//             user: { connect: { id: dto.userId } },
//             prediction: { connect: { id: dto.predictionId } }
//         }
//         return await this.prismaClient.bet.create({
//             data: data
//         })
//     }

//     async getMany(dto: BetRepositoryInputs.GetMany): Promise<Bet[]> {
//         const whereClause: Prisma.BetWhereInput = {
//             user_id: dto.userId, // Required field
//         };

//         if (dto.status) {
//             whereClause.status = dto.status;
//         }

//         if (dto.marketId) {
//             whereClause.prediction = {
//                 market_id: dto.marketId
//             }
//         }
//         return await this.prismaClient.bet.findMany({
//             where: whereClause
//         })
//     }

//     async getById(betId: string): Promise<Bet> {

//     }

//     async cancelById(betId: string): Promise<Bet> {

//     }

// }