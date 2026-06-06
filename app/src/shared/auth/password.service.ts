import bcrypt from 'bcryptjs'
import { UnexpectedEnvVar } from '../exception/serverException.js'

class PasswordService {
    private readonly saltRounds: number

    constructor() {
        const parsed = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '', 10)
        this.saltRounds = Number.isInteger(parsed) ? parsed : 12
        if (this.saltRounds < 10) throw new UnexpectedEnvVar('BCRYPT_SALT_ROUNDS must be at least 10')
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

export const passwordService = new PasswordService()