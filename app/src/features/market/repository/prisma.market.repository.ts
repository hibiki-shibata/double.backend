import type { MarketRepository, MarketRepositoryInput, MarketWithPredictions } from "./market.repository.js";
import type { Prisma, PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js";

export class PrismaMarketRepository implements MarketRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) { }

    async getById(marketId: string): Promise<MarketWithPredictions> {
        return await this.prismaClient.market.findUniqueOrThrow({
            where: { id: marketId },
            include: { predictions: true }
        })
    }

    async getMany(
        dto: MarketRepositoryInput.GetMany
    ): Promise<MarketWithPredictions[]> {
        const whereInput: Prisma.MarketWhereInput = {}
        if (dto.status) whereInput.status = { in: dto.status }
        const result = await this.prismaClient.market.findMany({
            where: whereInput,
            skip: dto.paginationInput.offset,
            take: dto.paginationInput.limit,
            orderBy: { close_at: 'desc' },
            include: { predictions: true }
        })
        return result
    }
}