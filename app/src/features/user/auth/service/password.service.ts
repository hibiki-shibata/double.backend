// passwordService.ts
import bcrypt from 'bcryptjs'
import { passwordEncoderOptions } from '../../../../shared/config/security.config.js'
import { UnexpectedEnvVar } from '../../../../shared/exception/serverException.js'
import { InvalidInput } from '../../../../shared/exception/httpException.js'

export class PasswordService {
    constructor(private readonly saltRounds: number) {
        if (
            !Number.isInteger(saltRounds) ||
            saltRounds < passwordEncoderOptions.min_salt_rounds ||
            saltRounds > passwordEncoderOptions.max_salt_round
        ) {
            throw new UnexpectedEnvVar('BCRYPT_SALT_ROUNDS must be 10 <= integer <= 15')
        }
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds)
    }

    public async verifyPassword(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<void> {
        try {
            const isPasswordValid: boolean = await bcrypt.compare(inputPassword, storedHashedPassword)
            console.log("isPasswordValid")
            console.log(inputPassword)
            console.log(isPasswordValid)
            if (!isPasswordValid) throw new InvalidInput('Input password was invalid')
        } catch {
            throw new InvalidInput('Password validation failed')
        }
    }
}

export const passwordService = new PasswordService(passwordEncoderOptions.saltRound)