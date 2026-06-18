export interface PasswordService {
    hashPassword(password: string): Promise<string>
    verifyPassword(inputPassword: string, storedHashedPassword: string): Promise<void>
}