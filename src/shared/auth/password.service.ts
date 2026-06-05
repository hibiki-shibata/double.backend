import crypt from 'crypto'
// Update later
const hash = crypt.createHash('sha256')

export const PasswordService = {
    hashPassword(password: string): string {
        hash.update(password)
        return hash.digest('hex')
    },

    isPasswordValid(
        inputPassword: string,
        storedHashedPassword: string
    ): Boolean {
        hash.update(inputPassword)
        const isPasswordValid: boolean
            = hash.digest('hex') === storedHashedPassword
        return isPasswordValid
    }
}