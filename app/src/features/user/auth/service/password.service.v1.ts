import bcrypt from 'bcryptjs'
import type { PasswordService } from './password.service.js'
import { passwordEncoderOptions } from '../../../../shared/config/security.config.js'
import { UnexpectedEnvVarErr } from '../../../../shared/error/serverErros.js'
import { InvalidInputErr } from '../../../../shared/error/httpErrors.js'

export class PasswordServiceV1 implements PasswordService {
    constructor(
        private readonly saltRounds: number
    ) {
        if (
            !Number.isInteger(saltRounds) ||
            saltRounds < passwordEncoderOptions.min_salt_rounds ||
            saltRounds > passwordEncoderOptions.max_salt_round
        ) {
            throw new UnexpectedEnvVarErr('BCRYPT_SALT_ROUNDS must be 10 <= integer <= 15')
        }
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds)
    }

    public async verifyPassword(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<void> {
        const isPasswordValid: boolean = await bcrypt.compare(inputPassword, storedHashedPassword)
        if (!isPasswordValid) throw new InvalidInputErr('Input password was invalid')
    }
}