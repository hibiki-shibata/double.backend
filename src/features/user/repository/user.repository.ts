import { type User, UserStatus, UserRoles } from '../../../shared/infra/db/generated.prisma/client.js'
import { prisma } from '../../../shared/infra/db/postgresClient.js'


export const userRepository = {
    async createUser(
        newUser: User
    ): Promise<User> {
        return await prisma.user.create({
            data: newUser,
            include: { wallets: true }
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
        user: User
    ): Promise<User> {
        return await prisma.user.update({
            where: { id: user.id },
            data: { user }
        })
    },

    async deleteUser(
        user: User
    ): Promise<User> {
        return await prisma.user.update({
            where: { id: user.id },
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