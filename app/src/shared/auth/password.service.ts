// passwordService.ts
import bcrypt from 'bcryptjs'
import { UnexpectedEnvVar } from '../exception/serverException.js'

export class PasswordService {
    constructor(private readonly saltRounds: number) {
        if (!Number.isInteger(saltRounds) || saltRounds < 10) {
            throw new UnexpectedEnvVar('BCRYPT_SALT_ROUNDS must be an integer >= 10')
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

const parsed: number = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '', 10)
const saltRounds: number = Number.isInteger(parsed) ? parsed : 12
export const passwordService = new PasswordService(saltRounds)