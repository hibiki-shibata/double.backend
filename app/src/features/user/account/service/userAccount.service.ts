import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js"

export interface UserAccountService {
    getMyAccount(userId: string): Promise<UserAccountResponse>
    updateMyAccount(userId: string, dto: UserAccountRequest): Promise<UserAccountResponse>
    deleteMyAccount(userId: string): Promise<void>
}
