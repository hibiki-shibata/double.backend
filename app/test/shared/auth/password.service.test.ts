import { describe, test, expect } from 'vitest'
import { PasswordService } from '../../../src/shared/auth/password.service.js'
import { UnexpectedEnvVar } from '../../../src/shared/exception/serverException.js'

describe('Password service Unit Test for edge cases', () => {

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
})