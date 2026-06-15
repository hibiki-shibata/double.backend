import type { UserRepository, UserCreateDBInput, UserUpdateDBInput } from "./user.repository.js"
import { UserRoles, UserStatus, type Prisma, type PrismaClient, type User } from "../../../../shared/infra/db/generated.prisma/client.js"

export class PrismaUserRepository implements UserRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

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

    async createUser(userCreateInput: UserCreateDBInput): Promise<User> {
        const data: Prisma.UserCreateInput = this.toPrismaUserCreateInput(userCreateInput)
        return await this.db.user.create({
            data: data
            // include: { wallets: true }
        })
    }

    async updateUserById(userId: string, userUpdateInput: UserUpdateDBInput): Promise<User> {
        const data: Prisma.UserUpdateInput = this.toPrismaUserUpdateInput(userUpdateInput)
        return await this.db.user.update({
            where: { id: userId },
            data: data
        })
    }

    async softDeleteUserById(userId: string): Promise<void> {
        const deletedUserState: UserUpdateDBInput = {
            name: null,
            displayName: 'deleted',
            emailAddress: null,
            passwordHash: null,
            status: UserStatus.deleted,
            roles: [UserRoles.deleted]
        }
        await this.updateUserById(userId, deletedUserState)
    }

    private toPrismaUserCreateInput(data: UserCreateDBInput): Prisma.UserCreateInput {
        return {
            name: data.name,
            display_name: data.displayName,
            password_hash: data.passwordHash,
            status: data.status,
            roles: data.roles,
        }
    }

    private toPrismaUserUpdateInput(data: UserUpdateDBInput): Prisma.UserUpdateInput {
        const prismaData: Prisma.UserUpdateInput = {}
        if (data.name !== undefined) prismaData.name = data.name
        if (data.displayName !== undefined) prismaData.display_name = data.displayName
        if (data.passwordHash !== undefined) prismaData.password_hash = data.passwordHash
        if (data.emailAddress !== undefined) prismaData.email_address = data.emailAddress
        if (data.status !== undefined) prismaData.status = data.status
        if (data.roles !== undefined) prismaData.roles = data.roles
        return prismaData
    }
}