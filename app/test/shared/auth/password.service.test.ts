import { vi, describe, test, expect, afterEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { PasswordService } from '../../../src/shared/auth/service/password.service.js'
import { UnexpectedEnvVar } from '../../../src/shared/exception/serverException.js'
import { InvalidInput } from '../../../src/shared/exception/httpException.js'

afterEach(() => {
    vi.restoreAllMocks()
})

describe('PasswordService instanciation edge case', () => {

    test('saltRound was a integer of smaller than 10', () => {
        expect(() => new PasswordService(9)).toThrow(UnexpectedEnvVar)
    })

    test('saltRound was bigger than 15', () => {
        expect(() => new PasswordService(16)).toThrow(UnexpectedEnvVar)
    })

    test('saltRound was a fractional number', () => {
        expect(() => new PasswordService(0.1)).toThrow(UnexpectedEnvVar)
    })

    test('saltRound was negative was a negative integer', () => {
        expect(() => new PasswordService(-1)).toThrow(UnexpectedEnvVar)
    })

    test('saltRound was too long number', () => {
        expect(() => new PasswordService(9999999999999999)).toThrow(UnexpectedEnvVar)
    })
})


describe('PasswordService.hashPassword edge cases', () => {
    const inputPassword: string = 'secret1234'
    const saltRound: number = 12
    const passwordService = new PasswordService(saltRound)

    test('should hash password using configured salt rounds', async () => {
        const mockedHashedPassword = 'hashed-password'
        vi.spyOn(bcrypt, 'hash').mockImplementationOnce(() => mockedHashedPassword)
        expect(await passwordService.hashPassword(inputPassword)).toBe(mockedHashedPassword)
        expect(bcrypt.hash).toHaveBeenCalledWith(inputPassword, saltRound)
    })

    test('should propagate bcrypt hash errors', async () => {
        vi.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error('Faild hashing password'))
        expect(passwordService.hashPassword(inputPassword)).rejects.toThrow(Error)
    })
})


describe('PasswordService.verifyPassword edge cases', () => {
    const inputPassword: string = 'secret1234'
    const saltRound: number = 12
    const passwordService = new PasswordService(saltRound)

    test('should not throw error when password was valid', async () => {
        const hashedPassword: string = await passwordService.hashPassword(inputPassword)
        expect(passwordService.verifyPassword(inputPassword, hashedPassword)).resolves.not.toThrow(Error)
    })

    test('should throw error when password was invalid', async () => {
        const hashedPassword: string = await passwordService.hashPassword(inputPassword)

        expect(passwordService.verifyPassword('wrong-password', hashedPassword)).rejects.toThrow(InvalidInput)
    })
})