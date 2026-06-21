import type { UserAccountResponse, UserAccountEditRequest } from "../schema/userAccount.schema.js"

export interface UserAccountService {
    getAccountInfo(userId: string): Promise<UserAccountResponse>
    updateAccount(userId: string, dto: UserAccountEditRequest): Promise<UserAccountResponse>
    deleteAccount(userId: string): Promise<void>
}
