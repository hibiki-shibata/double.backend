import type { UserRepository } from '../../../../src/features/user/shared/repository/user.repository.js'
import type { UserAccountRequest } from '../../../../src/features/user/account/schema/userAccount.schema.js'
import { vi, describe, test, expect, afterEach } from 'vitest'
import { UserAccountServiceV1 } from '../../../../src/features/user/account/service/userAccount.service.v1.js'
import { logger } from '../../../../src/shared/logger/logger.js'
import { UserRoles, UserStatus, type User } from '../../../../src/shared/infra/db/generated.prisma/client.js'

const testUser: User = {
    id: 'useriId-123',
    name: '@hibiki',
    display_name: 'hibiki shibata',
    email_address: 'hibiki@email.com',
    password_hash: 'hashed-password-yay',
    status: UserStatus.active,
    roles: [UserRoles.user],
    created_at: new Date(1234567),
    updated_at: new Date(1234567),
}

const testRepository: UserRepository = {
    getUserById: vi.fn(),
    getUserByUserName: vi.fn(),
    getUserByEmail: vi.fn(),
    updateUserById: vi.fn(),
    softDeleteUserById: vi.fn(),
    createUser: vi.fn(),
}

const testService = new UserAccountServiceV1(
    testRepository,
    logger
)

const testUserAccountRequest: UserAccountRequest = {
    name: 'Updated User',
    displayName: 'Updated',
    emailAddress: 'updated@example.com',
}

afterEach(() => vi.clearAllMocks())

describe('UserAccountServiceV1.getMyAccount()', () => {

    test('repository error should propagate', async () => {
        vi.spyOn(testRepository, 'getUserById').mockRejectedValueOnce(new Error())

        await expect(testService.getMyAccount('invalid-user-id')).rejects.toThrow(Error)
    })

    test('deleted user should throw InvalidInputErr', async () => {
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce({
            ...testUser, status: UserStatus.deleted
        })

        await expect(testService.getMyAccount('deleted-user-id')).rejects.toThrow('User has already been deleted')
    })

    test('active user should return account response', async () => {
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce(testUser)

        await expect(testService.getMyAccount('valid-user-id')).resolves.toEqual({
            id: testUser.id,
            name: testUser.name,
            displayName: testUser.display_name,
            emailAddress: testUser.email_address,
            status: testUser.status,
        })
    })
})


describe('UserAccountServiceV1.updateMyAccount()', () => {

    test('repository error on verify should propagate', async () => {
        vi.spyOn(testRepository, 'getUserById').mockRejectedValueOnce(new Error())

        await expect(testService.updateMyAccount('invalid-user-id', testUserAccountRequest)).rejects.toThrow(Error)
    })

    test('deleted user should throw InvalidInputErr', async () => {
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce({
            ...testUser, status: UserStatus.deleted
        })

        await expect(testService.updateMyAccount('deleted-user-id', testUserAccountRequest)).rejects.toThrow('User has already been deleted')
    })

    test('active user should return updated account response', async () => {
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce(testUser)
        vi.spyOn(testRepository, 'updateUserById').mockResolvedValueOnce(testUser)

        await expect(testService.updateMyAccount('valid-user-id', testUserAccountRequest)).resolves.toEqual({
            id: testUser.id,
            name: testUser.name,
            displayName: testUser.display_name,
            emailAddress: testUser.email_address,
            status: testUser.status,
        })
    })
})


describe('UserAccountServiceV1.deleteMyAccount()', () => {

    test('repository error on verify should propagate', async () => {
        vi.spyOn(testRepository, 'getUserById').mockRejectedValueOnce(new Error())

        await expect(testService.deleteMyAccount('invalid-user-id')).rejects.toThrow(Error)
    })

    test('deleted user should throw InvalidInputErr', async () => {
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce({
            ...testUser, status: UserStatus.deleted
        })

        await expect(testService.deleteMyAccount('deleted-user-id')).rejects.toThrow('User has already been deleted')
    })

    test('active user should soft delete without error', async () => {
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce(testUser)
        vi.spyOn(testRepository, 'softDeleteUserById').mockResolvedValueOnce(undefined)

        await expect(testService.deleteMyAccount('valid-user-id')).resolves.toBeUndefined()
    })
})