import { vi, describe, test, expect, afterEach } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import type { JwtOptions } from '../../../src/shared/config/security.config.js'
import { JwtTokenServiceV1 } from '../../../src/shared/auth/service/jwtToken.service.v1.js'
import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from '../../../src/shared/auth/type/jwtToken.type.js'
import { UserRoles } from '../../../src/shared/infra/db/generated.prisma/enums.js'
import { UnexpectedEnvVarErr } from '../../../src/shared/error/serverErros.js'
import { UnauthenticatedErr } from '../../../src/shared/error/httpErrors.js'

afterEach(() => {
    vi.restoreAllMocks()
})

const testJwtOptions: JwtOptions = {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '9d',
    issuer: 'test-issur',
    algorithm: 'HS256',
    maxSecretLength: 70,
    minSecretLength: 32,
    secretKey: '1234567890123456789012345678901234'
}

const testAccessTokenClaim: AccessTokenClaim = {
    type: TokenType.accessToken,
    userId: '1234567',
    userName: 'test-username',
    roles: [UserRoles.user],
    iat: Date.now(),
}

const testRefreshTokenClaim: RefreshTokenClaim = {
    type: TokenType.refreshToken,
    userId: '7654321',
}

const testJwtTokenService = new JwtTokenServiceV1(testJwtOptions, uuidv4)

describe('JwtTokenService instanciation edge cases', () => {
    test('should throw Error when secretKey was less than min length', () => {
        const shortSecretKey: JwtOptions = {
            ...testJwtOptions,
            maxSecretLength: 10,
            minSecretLength: 5,
            secretKey: '1'.repeat(4)
        }
        expect(() => new JwtTokenServiceV1(shortSecretKey, uuidv4)).toThrow(UnexpectedEnvVarErr)
    })

    test('should throw Error when secretKey was longer than max length', () => {
        const longSecretKey: JwtOptions = {
            ...testJwtOptions,
            maxSecretLength: 10,
            minSecretLength: 5,
            secretKey: '1'.repeat(11)
        }
        expect(() => new JwtTokenServiceV1(longSecretKey, uuidv4)).toThrow(UnexpectedEnvVarErr)
    })

    test('should NOT throw Error when secret key was within limit', () => {
        const validSecretKey: JwtOptions = {
            ...testJwtOptions,
            maxSecretLength: 10,
            minSecretLength: 5,
            secretKey: '1'.repeat(7)
        }
        expect(() => new JwtTokenServiceV1(validSecretKey, uuidv4)).not.toThrow()
    })
})


describe('JwtToken.verifyAccessToken', () => {
    const testValidAccessToken: string = testJwtTokenService.generateAccessToken(testAccessTokenClaim.userId, testAccessTokenClaim.userName, testAccessTokenClaim.roles)
    const testValidRefreshToken: string = testJwtTokenService.generateRefreshToken(testRefreshTokenClaim.userId)

    test('Invalid token should throw Unauthenticated Error', () => {
        expect(() => testJwtTokenService.verifyAccessToken('invalid-token')).toThrow(UnauthenticatedErr)
    })

    test('Wrong Token type(valid token sign) should throw Unauthenticated Error', () => {
        expect(() => testJwtTokenService.verifyAccessToken(testValidRefreshToken)).toThrow(UnauthenticatedErr)
        expect(() => testJwtTokenService.verifyRefreshToken(testValidAccessToken)).toThrow(UnauthenticatedErr)
    })

    test('Input accessTokenClaim and Verified accessTokenClaim should be the same', () => {
        const verifiedAccessTokenClaim: AccessTokenClaim = testJwtTokenService.verifyAccessToken(testValidAccessToken)
        expect(verifiedAccessTokenClaim.userId).toEqual(testAccessTokenClaim.userId)
    })

    test('Input refreshTokenClaim and Verified refreshTokenClaim should be the same', () => {
        const verifiedRefreshTokenClaim: RefreshTokenClaim = testJwtTokenService.verifyRefreshToken(testValidRefreshToken)
        expect(verifiedRefreshTokenClaim.userId).toEqual(testRefreshTokenClaim.userId)
    })
})


describe('JwtTokenService.getJwtToken edge cases', () => {
    test('should return AccessToken issured by jsonWebToken', () => {
        const expectedJwtToken = 'generated-token'
        vi.spyOn(jwt, 'sign').mockImplementation(() => expectedJwtToken)

        expect(testJwtTokenService.generateAccessToken(
            testAccessTokenClaim.userId,
            testAccessTokenClaim.userName,
            testAccessTokenClaim.roles
        )).toEqual(expectedJwtToken)
    })

    test('should return RefreshToken issured by jsonWebToken', () => {
        const expectedJwtToken = 'generated-token'
        vi.spyOn(jwt, 'sign').mockImplementation(() => expectedJwtToken)

        expect(testJwtTokenService.generateRefreshToken(
            testRefreshTokenClaim.userId
        )).toEqual(expectedJwtToken)
    })
})