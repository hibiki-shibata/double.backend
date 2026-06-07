import { vi, describe, test, expect, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtTokenService } from '../../../src/shared/auth/jwtToken.service.js'
import { UnexpectedEnvVar } from '../../../src/shared/exception/serverException.js'
import { TokenType, type AccessTokenClaim, type JwtTokenResponse, type RefreshTokenClaim } from '../../../src/shared/auth/jwtToken.type.js'
import { UserRoles } from '../../../src/shared/infra/db/generated.prisma/enums.js'

afterEach(() => {
    vi.restoreAllMocks()
})

describe('JwtTokenService instanciation edge cases', () => {
    test('should throw Error when secretKey was less than 32 letter', () => {
        const shortSecretKey = '123456789'
        expect(() => new JwtTokenService(shortSecretKey)).toThrow(UnexpectedEnvVar)
    })

    test('should throw Error when secretKey was longer than 50 letter', () => {
        const longSecretKey = '123456789123456789123456789123456789123456789123456789123456789123456789'
        expect(() => new JwtTokenService(longSecretKey)).toThrow(UnexpectedEnvVar)
    })
})


describe('JwtTokenService.getFreshToken edge cases', () => {
    const validSecretKey = '1234567890123456789012345678901234567890'
    const jwtTokenService = new JwtTokenService(validSecretKey)

    const accessTokenClaim: AccessTokenClaim = {
        type: TokenType.accessToken,
        userId: 'user-id',
        userName: 'user-name',
        roles: [UserRoles.user],
        iat: new Date(Date.now()),
    }

    const refreshTokenClaim: RefreshTokenClaim = {
        type: TokenType.refreshToken,
        tokenId: 'token-id',
        userId: 'user-id',
    }

    test('should return JwtToken issured by jsonWebToken', () => {
        const generatedJwtToken = 'generated-token'
        vi.spyOn(jwt, 'sign').mockImplementation(() => generatedJwtToken)

        const expectedResult: JwtTokenResponse = {
            accessToken: generatedJwtToken,
            refreshToken: generatedJwtToken
        }
        expect(jwtTokenService.getFreshTokens(accessTokenClaim, refreshTokenClaim)).toEqual(expectedResult)

    })
})