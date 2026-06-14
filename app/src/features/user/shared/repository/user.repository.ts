import { type User, UserRoles, UserStatus } from '../../../../shared/infra/db/generated.prisma/client.js'

export type UserCreateDBInput = {
    name: string,
    displayName: string,
    passwordHash: string,
    status: UserStatus,
    roles: UserRoles[],
}

export type UserUpdateDBInput = {
    name?: string | null,
    displayName?: string,
    passwordHash?: string | null,
    emailAddress?: string | null,
    status?: UserStatus,
    roles?: UserRoles[],
}

export type UserRepository = {
    getUserById(userId: string): Promise<User>
    getUserByEmail(emailAddress: string): Promise<User>
    getUserByUserName(userName: string): Promise<User>
    createUser(user: UserCreateDBInput): Promise<User>
    updateUserById(userId: string, data: UserUpdateDBInput): Promise<User>
}