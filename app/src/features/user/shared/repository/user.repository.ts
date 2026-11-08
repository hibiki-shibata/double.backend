import { type User, UserRoles, UserStatus } from '@global-shared/infra/db/generated.prisma/client.js'

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
    updateUserById(userId: string, input: UpdateUserInput): Promise<User>
    softDeleteById(userId: string): Promise<User>
}