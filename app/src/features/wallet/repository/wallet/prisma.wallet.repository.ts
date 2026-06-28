
import type { PrismaClient, Wallet } from "@global-shared/infra/db/generated.prisma/client.js"
import type { WalletRepository, WalletRepositoryInput } from "./wallet.repository.js"

export class PrismaWalletRepository implements WalletRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) { }

    async getByUserId(userId: string): Promise<Wallet> {
        return this.prismaClient.wallet.findUniqueOrThrow({
            where: { user_id: userId },
        })
    }

    async safeDepositBalance(dto: WalletRepositoryInput.SafeDepositBalance): Promise<Wallet> {
        return dto.tx.wallet.update({
            where: {
                id: dto.walletId,
                status: { in: dto.allowedWalletStatus },
            },
            data: {
                balance: { increment: dto.amount }
            },
        })
    }

    async safeWithdrawBalance(dto: WalletRepositoryInput.SafeWithdrawBalance): Promise<Wallet> {
        return dto.tx.wallet.update({
            where: {
                id: dto.walletId,
                status: { in: dto.allowedWalletStatus },
                balance: { gte: dto.amount }
            },
            data: {
                balance: { decrement: dto.amount }
            },
        })
    }
}
