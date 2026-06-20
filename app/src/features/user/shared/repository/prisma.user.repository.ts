import { UserRoles, UserStatus, type User, type Prisma, type PrismaClient } from "@global-shared/infra/db/generated.prisma/client.js"
import type { CreateUserInput, UpdateUserInput, UserRepository } from "./user.repository.js"

export class PrismaUserRepository implements UserRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) { }

    async getById(userId: string): Promise<User> {
        return await this.prismaClient.user.findUniqueOrThrow({
            where: { id: userId }
        })
    }

    async getByEmail(emailAddress: string): Promise<User> {
        return await this.prismaClient.user.findUniqueOrThrow({
            where: { email_address: emailAddress }
        })
    }

    async getByUserName(userName: string): Promise<User> {
        return await this.prismaClient.user.findUniqueOrThrow({
            where: { name: userName }
        })
    }

    async createUser(dto: CreateUserInput): Promise<User> {
        const data: Prisma.UserCreateInput = {
            name: dto.name,
            display_name: dto.displayName,
            password_hash: dto.passwordHash,
            status: dto.status,
            roles: dto.roles,
        }
        return await this.prismaClient.user.create({
            data: data
        })
    }

    async updateUserById(userId: string, dto: UpdateUserInput): Promise<User> {
        const data: Prisma.UserUpdateInput = {}
        if (dto.name) data.name = dto.name
        if (dto.displayName) data.display_name = dto.displayName
        if (dto.passwordHash) data.password_hash = dto.passwordHash
        if (dto.emailAddress) data.email_address = dto.emailAddress
        if (dto.status) data.status = dto.status
        if (dto.roles) data.roles = dto.roles
        return await this.prismaClient.user.update({
            where: { id: userId },
            data: data
        })
    }

    async softDeleteById(userId: string): Promise<User> {
        const deletedUserState: UpdateUserInput = {
            name: null,
            displayName: 'deleted',
            emailAddress: null,
            passwordHash: null,
            status: UserStatus.DELETED,
            roles: [UserRoles.DELETED]
        }
        return await this.updateUserById(userId, deletedUserState)
    }
}