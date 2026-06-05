import bcrypt from 'bcryptjs'

export const PasswordService = {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, process.env.BYCRYPT_SALT_ROUNDS ?? 12)
    },

    async isPasswordValid(
        inputPassword: string,
        storedHashedPassword: string
    ): Promise<Boolean> {
        return await bcrypt.compare(inputPassword, storedHashedPassword)
    }
}