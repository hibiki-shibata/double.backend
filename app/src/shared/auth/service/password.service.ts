// passwordService.ts
import bcrypt from 'bcryptjs'
import { UnexpectedEnvVar } from '../../exception/serverException.js'
import { passwordEncoderConfig } from '../../config/security.config.js'

export class PasswordService {
    constructor(private readonly saltRounds: number) {
        if (
            !Number.isInteger(saltRounds) ||
            saltRounds < passwordEncoderConfig.min_salt_rounds ||
            saltRounds > passwordEncoderConfig.max_salt_round
        ) {
            throw new UnexpectedEnvVar('BCRYPT_SALT_ROUNDS must be 10 <= integer <= 15')
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds)
    }

    async isPasswordValid(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(inputPassword, storedHashedPassword)
    }
}