import { vi, describe, test, expect, afterEach } from 'vitest'
import { type User, UserRoles, UserStatus } from '../../../../src/shared/infra/db/generated.prisma/client.js'
import { UserAuthServiceV1 } from '../../../../src/features/user/auth/service/userAuth.service.v1.js'
import { logger } from '../../../../src/shared/logger/logger.js'
import type { UserRepository } from '../../../../src/features/user/shared/repository/user.repository.js'
import type { PasswordService } from '../../../../src/shared/auth/service/password.service.js'
import type { JwtTokenService } from '../../../../src/shared/auth/service/jwtToken.service.js'
import type { UserLoginRequest } from '../../../../src/features/user/auth/dto/userAuth.dto.js'
import { TokenType } from '../../../../src/shared/auth/type/jwtToken.type.js'

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

const testPasswordService: PasswordService = {
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
}

const testJwtService: JwtTokenService = {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
}

const testTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
}

const testLoginRequest: UserLoginRequest = {
    userName: 'testuser',
    password: 'password123',
}

const testService = new UserAuthServiceV1(testRepository, testPasswordService, testJwtService, logger)

afterEach(() => vi.clearAllMocks())

describe('UserAuthServiceV1.login()', () => {

    test('repository error should propagate', async () => {
        vi.spyOn(testRepository, 'getUserByUserName').mockRejectedValueOnce(new Error())

        await expect(testService.login(testLoginRequest)).rejects.toThrow(Error)
    })

    test('deleted user should throw InvalidInputErr', async () => {
        vi.spyOn(testRepository, 'getUserByUserName').mockResolvedValueOnce({
            ...testUser, status: UserStatus.deleted
        })

        await expect(testService.login(testLoginRequest)).rejects.toThrow('User has already been deleted')
    })

    test('missing password hash should throw DatabaseErr', async () => {
        vi.spyOn(testRepository, 'getUserByUserName').mockResolvedValueOnce({
            ...testUser, password_hash: null
        })

        await expect(testService.login(testLoginRequest)).rejects.toThrow('Missing password registeration in DB')
    })

    test('wrong password should propagate verifyPassword error', async () => {
        vi.spyOn(testRepository, 'getUserByUserName').mockResolvedValueOnce(testUser)
        vi.spyOn(testPasswordService, 'verifyPassword').mockRejectedValueOnce(new Error('Invalid password'))

        await expect(testService.login(testLoginRequest)).rejects.toThrow('Invalid password')
    })

    test('valid credentials should return jwt tokens', async () => {
        vi.spyOn(testRepository, 'getUserByUserName').mockResolvedValueOnce(testUser)
        vi.spyOn(testPasswordService, 'verifyPassword').mockResolvedValueOnce(undefined)
        vi.spyOn(testJwtService, 'generateAccessToken').mockReturnValueOnce(testTokens.accessToken)
        vi.spyOn(testJwtService, 'generateRefreshToken').mockReturnValueOnce(testTokens.refreshToken)

        await expect(testService.login(testLoginRequest)).resolves.toEqual(testTokens)
    })
})



describe('UserAuthServiceV1.refreshToken()', () => {

    test('invalid refresh token should propagate verifyRefreshToken error', async () => {
        vi.spyOn(testJwtService, 'verifyRefreshToken').mockImplementationOnce(() => { throw new Error('Invalid token') })

        await expect(testService.refreshToken('invalid-token')).rejects.toThrow('Invalid token')
    })

    test('repository error should propagate', async () => {
        vi.spyOn(testJwtService, 'verifyRefreshToken').mockReturnValueOnce({ type: TokenType.refreshToken, userId: 'valid-user-id' })
        vi.spyOn(testRepository, 'getUserById').mockRejectedValueOnce(new Error())

        await expect(testService.refreshToken('valid-token')).rejects.toThrow(Error)
    })

    test('deleted user should throw InvalidInputErr', async () => {
        vi.spyOn(testJwtService, 'verifyRefreshToken').mockReturnValueOnce({ type: TokenType.refreshToken, userId: 'valid-user-id' })
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce({
            ...testUser, status: UserStatus.deleted
        })

        await expect(testService.refreshToken('valid-token')).rejects.toThrow('User has already been deleted')
    })

    test('valid token should return new jwt tokens', async () => {
        vi.spyOn(testJwtService, 'verifyRefreshToken').mockReturnValueOnce({ type: TokenType.refreshToken, userId: 'valid-user-id' })
        vi.spyOn(testRepository, 'getUserById').mockResolvedValueOnce(testUser)
        vi.spyOn(testJwtService, 'generateAccessToken').mockReturnValueOnce(testTokens.accessToken)
        vi.spyOn(testJwtService, 'generateRefreshToken').mockReturnValueOnce(testTokens.refreshToken)

        await expect(testService.refreshToken('valid-token')).resolves.toEqual(testTokens)
    })
})