import { prisma } from '../../../shared/infra/db/postgresClient.js'
import { type User, UserStatus, UserRoles } from '../../../shared/infra/db/generated.prisma/client.js'
import type { UserAccountRequest, CreateUserDto } from '../dto/userAccount.dto.js'


export const UserRepository = {
    async createUser(
        user: CreateUserDto
    ): Promise<User> {
        return await prisma.user.create({
            data: {
                name: user.userName,
                display_name: user.displayName,
                password_hash: user.passwordHash,
                status: user.status,
                roles: user.roles
            },
            include: { wallets: true }
        })
    },

    async getUserById(
        userId: string
    ): Promise<User> {
        return await prisma.user.findUniqueOrThrow({
            where: { id: userId }
        })
    },

    async getUserByEmail(
        emailAddress: string
    ): Promise<User> {
        return await prisma.user.findUniqueOrThrow({
            where: { email_address: emailAddress }
        })
    },

    async getUserByUserName(
        userName: string
    ): Promise<User> {
        return await prisma.user.findUniqueOrThrow({
            where: { name: userName }
        })
    },

    async updateUser(
        user: UserAccountRequest
    ): Promise<User> {
        return await prisma.user.update({
            where: { id: user.id },
            data: { user }
        })
    },

    async deleteUserById(
        userId: string
    ): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                name: null,
                display_name: 'deleted',
                email_address: null,
                password_hash: null,
                status: UserStatus.deleted,
                roles: [UserRoles.deleted]
            }
        })
    }
}