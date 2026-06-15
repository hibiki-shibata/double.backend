import { vi, describe, test, expect, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtTokenServiceV1 } from '../../../src/shared/auth/service/jwtToken.service.v1.js'
import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from '../../../src/shared/auth/type/jwtToken.type.js'
import { UserRoles } from '../../../src/shared/infra/db/generated.prisma/enums.js'
import { UnexpectedEnvVarErr } from '../../../src/shared/error/serverErros.js'
import { UnauthenticatedErr } from '../../../src/shared/error/httpErrors.js'

afterEach(() => {
    vi.restoreAllMocks()
})

describe('JwtTokenService instanciation edge cases', () => {
    test('should throw Error when secretKey was less than 32 letter', () => {
        const shortSecretKey = '1'.repeat(31)
        expect(() => new JwtTokenServiceV1(shortSecretKey)).toThrow(UnexpectedEnvVarErr)
    })

    test('should throw Error when secretKey was longer than 70 letter', () => {
        const longSecretKey = '1'.repeat(71)
        expect(() => new JwtTokenServiceV1(longSecretKey)).toThrow(UnexpectedEnvVarErr)
    })

    test('should allow secretKey with exactly 32 characters', () => {
        const validSecretKey = '1'.repeat(32)

        expect(() => new JwtTokenServiceV1(validSecretKey)).not.toThrow()
    })
})

const accessTokenClaim: AccessTokenClaim = {
    type: TokenType.accessToken,
    userId: 'user-id',
    userName: 'user-name',
    roles: [UserRoles.user],
    iat: Date.now(),
}

const refreshTokenClaim: RefreshTokenClaim = {
    type: TokenType.refreshToken,
    tokenId: 'token-id',
    userId: 'user-id',
}

const validSecretKey = '1'.repeat(32)
const jwtTokenService = new JwtTokenServiceV1(validSecretKey)

describe('JwtTokenService.getFreshToken edge cases', () => {

    test('should return AccessToken issured by jsonWebToken', () => {
        const expectedJwtToken = 'generated-token'
        vi.spyOn(jwt, 'sign').mockImplementation(() => expectedJwtToken)

        expect(jwtTokenService.generateAccessToken(
            accessTokenClaim.userId,
            accessTokenClaim.userName,
            accessTokenClaim.roles
        )).toEqual(expectedJwtToken)
    })

    test('should return Refresh issured by jsonWebToken', () => {
        const expectedJwtToken = 'generated-token'
        vi.spyOn(jwt, 'sign').mockImplementation(() => expectedJwtToken)

        expect(jwtTokenService.generateRefreshToken(refreshTokenClaim.userId)).toEqual(expectedJwtToken)
    })
})

describe('JwtToken.verifyAccessToken', () => {
    const validAccessToken: string = jwtTokenService.generateAccessToken(
        accessTokenClaim.userId,
        accessTokenClaim.userName,
        accessTokenClaim.roles
    )
    const validRefreshToken: string = jwtTokenService.generateRefreshToken(refreshTokenClaim.userId)

    test('throw Error when token was invalid', () => {
        expect(() => jwtTokenService.verifyAccessToken('invalid-token')).toThrow(UnauthenticatedErr)
    })

    test('throw Error when claim was invalid while token is valid', () => {
        expect(() => jwtTokenService.verifyAccessToken(validRefreshToken)).toThrow(UnauthenticatedErr)
        expect(() => jwtTokenService.verifyRefreshToken(validAccessToken)).toThrow(UnauthenticatedErr)
    })

    test('retrieve AccessTokenClaim when Token was valid', () => {
        const retrievedClaim: AccessTokenClaim = jwtTokenService.verifyAccessToken(validAccessToken)
        expect(retrievedClaim.userId).toEqual(accessTokenClaim.userId)
        expect(retrievedClaim.roles).toEqual(accessTokenClaim.roles)
        expect(retrievedClaim.type).toEqual(accessTokenClaim.type)
        expect(retrievedClaim.userName).toEqual(accessTokenClaim.userName)
    })

    test('retrieve RefreshTokenClaim when Token was valid', () => {
        const retrievedClaim: RefreshTokenClaim = jwtTokenService.verifyRefreshToken(validRefreshToken)
        expect(retrievedClaim.userId).toEqual(refreshTokenClaim.userId)
        expect(retrievedClaim.tokenId).toEqual(refreshTokenClaim.tokenId)
        expect(retrievedClaim.type).toEqual(refreshTokenClaim.type)
    })
})