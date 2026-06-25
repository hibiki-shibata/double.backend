import type { BetRepository, BetRepositoryInput } from "./bet.repository.js";
import type { Bet, Prisma, PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js";
import { BetStatus } from "@global-shared/infra/db/generated.prisma/enums.js";

export class PrismaBetRepository implements BetRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) { }

    async create(dto: BetRepositoryInput.CreateBet): Promise<Bet> {
        const data: Prisma.BetCreateInput = {
            bet_amount: dto.betAmount,
            user: { connect: { id: dto.userId } },
            prediction: { connect: { id: dto.predictionId } }
        }
        return await this.prismaClient.bet.create({
            data: data
        })
    }

    async getMany(dto: BetRepositoryInput.GetMany): Promise<Bet[]> {
        const betWhereInput: Prisma.BetWhereInput = { user_id: dto.userId }
        if (dto.status) betWhereInput.status = { in: dto.status }
        if (dto.marketId) betWhereInput.prediction = { market_id: dto.marketId }

        return await this.prismaClient.bet.findMany({
            where: betWhereInput
        })
    }

    async getById(betId: string): Promise<Bet> {
        return await this.prismaClient.bet.findUniqueOrThrow({
            where: { id: betId }
        })
    }

    async cancelById(betId: string): Promise<Bet> {
        return this.prismaClient.bet.update({
            where: { id: betId },
            data: {
                status: BetStatus.CANCELLED
            }
        })
    }
}