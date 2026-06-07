// passwordService.ts
import bcrypt from 'bcryptjs'
import { UnexpectedEnvVar } from '../exception/serverException.js'
import { encryptionConfig } from '../config/encryption.config.js'

export class PasswordService {
    constructor(private readonly saltRounds: number) {
        console.log('CHECK HEREEEE')
        console.log(saltRounds)
        if (            
            !Number.isInteger(saltRounds) ||
            saltRounds <= encryptionConfig.min_salt_rounds ||
            saltRounds >= encryptionConfig.max_salt_round
        ) {
            throw new UnexpectedEnvVar('BCRYPT_SALT_ROUNDS must be 10 <= integer <= 15')
        }
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds)
    }

    async isPasswordValid(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<boolean> {
        return bcrypt.compare(inputPassword, storedHashedPassword)
    }
}

export const passwordService = new PasswordService(encryptionConfig.saltRound)