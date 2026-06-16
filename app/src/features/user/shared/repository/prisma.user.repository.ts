import { UserRoles, UserStatus, type Prisma, type PrismaClient, type User } from "../../../../shared/infra/db/generated.prisma/client.js"
import type { UserRepository, UserCreateDBInput, UserUpdateDBInput } from "./user.repository.js"

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

    async softDeleteUserById(userId: string): Promise<User> {
        const deletedUserState: UserUpdateDBInput = {
            name: null,
            displayName: 'deleted',
            emailAddress: null,
            passwordHash: null,
            status: UserStatus.deleted,
            roles: [UserRoles.deleted]
        }
        return await this.updateUserById(userId, deletedUserState)
    }

    private toPrismaUserCreateInput(input: UserCreateDBInput): Prisma.UserCreateInput {
        return {
            name: input.name,
            display_name: input.displayName,
            password_hash: input.passwordHash,
            status: input.status,
            roles: input.roles,
        }
    }

    private toPrismaUserUpdateInput(input: UserUpdateDBInput): Prisma.UserUpdateInput {
        const prismaData: Prisma.UserUpdateInput = {}
        if (input.name !== undefined) prismaData.name = input.name
        if (input.displayName !== undefined) prismaData.display_name = input.displayName
        if (input.passwordHash !== undefined) prismaData.password_hash = input.passwordHash
        if (input.emailAddress !== undefined) prismaData.email_address = input.emailAddress
        if (input.status !== undefined) prismaData.status = input.status
        if (input.roles !== undefined) prismaData.roles = input.roles
        return prismaData
    }
}