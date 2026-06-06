import bcrypt from 'bcryptjs'

class PasswordService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, Number(process.env.BYCRYPT_SALT_ROUNDS) ?? 12)
    }

    async isPasswordValid(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<Boolean> {
        return await bcrypt.compare(inputPassword, storedHashedPassword)
    }
}

export const passwordService = new PasswordService