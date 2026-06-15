import { describe, test, expect } from 'vitest'
import { PasswordServiceV1 } from '../../../../src/features/user/auth/service/password.service.v1.js'
import type { PasswordEncoderOptions } from '../../../../src/shared/config/security.config.js'

const validOptions: PasswordEncoderOptions = {
    saltRound: 10,
    min_salt_rounds: 8,
    max_salt_round: 12,
}

describe('PasswordServiceV1 constructor', () => {

    test('missing saltRound should throw UnexpectedEnvVarErr', () => {
        expect(() => new PasswordServiceV1({ ...validOptions, saltRound: 0 }))
            .toThrow('Missing saldRounds')
    })

    test('saltRound below minimum should throw UnexpectedEnvVarErr', () => {
        expect(() => new PasswordServiceV1({ ...validOptions, saltRound: 7 }))
            .toThrow('BCRYPT_SALT_ROUNDS must be between')
    })

    test('saltRound above maximum should throw UnexpectedEnvVarErr', () => {
        expect(() => new PasswordServiceV1({ ...validOptions, saltRound: 13 }))
            .toThrow('BCRYPT_SALT_ROUNDS must be between')
    })

    test('valid options should not throw', () => {
        expect(() => new PasswordServiceV1(validOptions)).not.toThrow()
    })
})

describe('PasswordServiceV1.hashPassword()', () => {

    const service = new PasswordServiceV1(validOptions)

    test('should return a bcrypt hash string', async () => {
        const hash = await service.hashPassword('password123')

        expect(hash).toMatch(/^\$2[ab]\$\d+\$/)
    })

    test('same password should produce different hashes', async () => {
        const hash1 = await service.hashPassword('password123')
        const hash2 = await service.hashPassword('password123')

        expect(hash1).not.toBe(hash2)
    })
})

describe('PasswordServiceV1.verifyPassword()', () => {

    const service = new PasswordServiceV1(validOptions)

    test('correct password should resolve without error', async () => {
        const hash = await service.hashPassword('password123')

        await expect(service.verifyPassword('password123', hash)).resolves.toBeUndefined()
    })

    test('wrong password should throw InvalidInputErr', async () => {
        const hash = await service.hashPassword('password123')

        await expect(service.verifyPassword('wrongpassword', hash)).rejects.toThrow('Input password was invalid')
    })
})