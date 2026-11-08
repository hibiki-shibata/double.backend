import type { User, UserRoles, UserStatus } from "@global-shared/infra/db/generated.prisma/client.js"

export type CreateUserInput = {
    name: string
    displayName: string,
    passwordHash: string,
    status: UserStatus,
    roles: UserRoles[],
}

export interface AuthRepository {
    getByEmail(email: string): Promise<User>
    getByUserName(userName: string): Promise<User>
    createUser(input: CreateUserInput): Promise<User>
}