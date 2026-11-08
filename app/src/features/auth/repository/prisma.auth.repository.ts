import type { PrismaClient } from "@prisma/client/extension";
import type { AuthRepository, CreateUserInput } from "./auth.repository.js";
import type { Prisma, User } from "@global-shared/infra/db/generated.prisma/client.js";

export class PrismaAuthRepository implements AuthRepository {
    constructor(
        private readonly prismaClient: PrismaClient
    ) { }

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
}