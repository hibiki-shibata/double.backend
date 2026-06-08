import { vi, describe, test, expect, afterEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { PasswordService } from '../../../src/shared/auth/service/password.service.js'
import { UnexpectedEnvVar } from '../../../src/shared/exception/serverException.js'

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
        vi.spyOn(bcrypt, 'hash').mockImplementationOnce(() => new Error('Faild hashing password'))
        expect(await passwordService.hashPassword(inputPassword)).toThrow(Error)
    })
})


describe('PasswordService.isPasswordValid edge cases', () => {
    const inputPassword: string = 'secret1234'
    const saltRound: number = 12
    const passwordService = new PasswordService(saltRound)

    test('should return true when password was valid', async () => {
        const hashedPassword: string = await passwordService.hashPassword(inputPassword)
        expect(await passwordService.isPasswordValid(inputPassword, hashedPassword)).toBeTruthy()
    })

    test('should return false when password was valid', async () => {
        const hashedPassword: string = await passwordService.hashPassword(inputPassword)
        expect(await passwordService.isPasswordValid('wrong-password', hashedPassword)).not.toBeTruthy()
    })
})