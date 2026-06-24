import type { MarketRepository, MarketWithPredictions } from "./market.repository.js";
import type { PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js";
import type { MarketStatus } from "@global-shared/infra/db/generated.prisma/enums.js";
import type { PaginationDBInput } from "@global-shared/types/pagination.type.js";

export class PrismaMarketRepository implements MarketRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

    async getById(marketId: string): Promise<MarketWithPredictions> {
        return await this.db.market.findUniqueOrThrow({
            where: { id: marketId },
            include: { predictions: true }
        })
    }

    async getByStatus(
        status: MarketStatus[], pagination: PaginationDBInput
    ): Promise<MarketWithPredictions[]> {
        const result = await this.db.market.findMany({
            where: { status: { in: status } },
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { close_at: 'desc' },
            include: { predictions: true }
        })
        return result
    }
}