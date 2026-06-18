import type { UserAccountResponse, UserAccountRequest } from "../schema/userAccount.schema.js"

export interface UserAccountService {
    getAccountInfo(userId: string): Promise<UserAccountResponse>
    updateAccount(userId: string, dto: UserAccountRequest): Promise<UserAccountResponse>
    deleteAccount(userId: string): Promise<void>
}
