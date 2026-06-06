// Doc: https://nodejs.org/learn/test-runner/using-test-runner
// app/test/passwordService.test.ts
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { PasswordService } from '../../../src/shared/auth/password.service.js'

const VALID_ROUNDS = 10 // minimum, keeps tests fast

describe('PasswordService', () => {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', () => {

        it('accepts valid salt rounds >= 10', () => {
            assert.doesNotThrow(() => new PasswordService(10))
            assert.doesNotThrow(() => new PasswordService(12))
        })

        it('throws when salt rounds is below 10', () => {
            assert.throws(
                () => new PasswordService(9),
                { message: 'BCRYPT_SALT_ROUNDS must be an integer >= 10' }
            )
        })

        it('throws when salt rounds is 0', () => {
            assert.throws(() => new PasswordService(0))
        })

        it('throws when salt rounds is negative', () => {
            assert.throws(() => new PasswordService(-1))
        })

        it('throws when salt rounds is NaN', () => {
            assert.throws(() => new PasswordService(NaN))
        })

        it('throws when salt rounds is a float', () => {
            assert.throws(() => new PasswordService(10.5))
        })
    })

    // -------------------------------------------------------------------------
    // hashPassword
    // -------------------------------------------------------------------------

    describe('hashPassword', () => {

        it('returns a valid bcrypt hash string', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('secret')
            assert.match(hash, /^\$2[aby]\$\d{2}\$.{53}$/) // strict bcrypt format
        })

        it('produces a different hash on each call for the same input', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const [h1, h2] = await Promise.all([
                svc.hashPassword('secret'),
                svc.hashPassword('secret'),
            ])
            assert.notEqual(h1, h2)
        })

        it('handles empty string as password', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('')
            assert.match(hash, /^\$2[aby]\$\d{2}\$.{53}$/)
        })

        it('handles a very long password', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const longPassword = 'a'.repeat(1000)
            const hash = await svc.hashPassword(longPassword)
            assert.match(hash, /^\$2[aby]\$\d{2}\$.{53}$/)
        })
    })

    // -------------------------------------------------------------------------
    // isPasswordValid
    // -------------------------------------------------------------------------

    describe('isPasswordValid', () => {

        it('returns true for a correct password', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('correct')
            assert.equal(await svc.isPasswordValid('correct', hash), true)
        })

        it('returns false for an incorrect password', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('correct')
            assert.equal(await svc.isPasswordValid('wrong', hash), false)
        })

        it('returns false for empty string against a non-empty password hash', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('correct')
            assert.equal(await svc.isPasswordValid('', hash), false)
        })

        it('returns true for empty string hashed and validated as empty string', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('')
            assert.equal(await svc.isPasswordValid('', hash), true)
        })

        it('is case-sensitive', async () => {
            const svc = new PasswordService(VALID_ROUNDS)
            const hash = await svc.hashPassword('Secret')
            assert.equal(await svc.isPasswordValid('secret', hash), false)
        })

        it('bcrypt silently truncates passwords beyond 72 bytes — both truncated inputs match', async () => {
            // bcrypt has a known 72-byte input limit, worth documenting as a test
            const svc = new PasswordService(VALID_ROUNDS)
            const base = 'a'.repeat(72)
            const hash = await svc.hashPassword(base)
            assert.equal(await svc.isPasswordValid(base + 'extra', hash), true)
        })
    })
})