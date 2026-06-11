import { prisma } from '../../../shared/infra/db/postgresClient.js'
import type { PrismaClient } from '@prisma/client/extension'
import { type User } from '../../../shared/infra/db/generated.prisma/client.js'
import type { UserCreateInput, UserUpdateInput } from '../../../shared/infra/db/generated.prisma/models.js'


export class UserRepository {
    constructor(private readonly db: PrismaClient) { }

    async createUser(user: UserCreateInput): Promise<User> {
        return await this.db.user.create({
            data: user,
            include: { wallets: true }
        })
    }

    async getUserById(userId: string): Promise<User> {
        return await this.db.user.findUniqueOrThrow({
            where: { id: userId }
        })
    }

    async getUserByEmail(emailAddress: string): Promise<User> {
        return await this.db.user.findUniqueOrThrow({
            where: { email_address: emailAddress }
        })
    }

    async getUserByUserName(userName: string): Promise<User> {
        return await this.db.user.findUniqueOrThrow({
            where: { name: userName }
        })
    }

    async updateUserById(userId: string, userUpdateInput: UserUpdateInput): Promise<User> {
        return await this.db.user.update({
            where: { id: userId },
            data: { userUpdateInput }
        })
    }
}

export const userRepository = new UserRepository(prisma)