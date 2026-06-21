import { type User, UserRoles, UserStatus } from '@global-shared/infra/db/generated.prisma/client.js'

export type CreateUserInput = {
    name: string
    displayName: string,
    passwordHash: string,
    status: UserStatus,
    roles: UserRoles[],
}

export type UpdateUserInput = {
    name?: string | null,
    displayName?: string,
    passwordHash?: string | null,
    emailAddress?: string | null,
    status?: UserStatus,
    roles?: UserRoles[],
}

export interface UserRepository {
    getById(userId: string): Promise<User>
    getByEmail(email: string): Promise<User>
    getByUserName(userName: string): Promise<User>
    createUser(input: CreateUserInput): Promise<User>
    updateUserById(userId: string, input: UpdateUserInput): Promise<User>
    softDeleteById(userId: string): Promise<User>
}