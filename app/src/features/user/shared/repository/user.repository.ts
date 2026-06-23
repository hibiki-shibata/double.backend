import type { User, UserRoles, UserStatus } from '@global-shared/infra/db/generated.prisma/client.js'

export namespace UserRepositoryInput {
    export type Create = {
        name: string
        displayName: string,
        passwordHash: string,
        status: UserStatus,
        roles: UserRoles[],
    }

    export type UpdateById = {
        name?: string | null,
        displayName?: string,
        passwordHash?: string | null,
        emailAddress?: string | null,
        status?: UserStatus,
        roles?: UserRoles[],
    }
}

export interface UserRepository {
    create(input: UserRepositoryInput.Create): Promise<User>
    updateById(userId: string, input: UserRepositoryInput.UpdateById): Promise<User>
    getById(userId: string): Promise<User>
    getByEmail(email: string): Promise<User>
    getByUserName(userName: string): Promise<User>
    // softDeleteById(userId: string): Promise<User>
}