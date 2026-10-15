import type { UserAccountResponse } from "../schema/userAccount.schema.js"

export namespace UserAccountServiceArgs {
    export type GetAccountDetail = {
        userId: string
    }
    export type UpdateAccountDetail = {
        userId: string
        name: string
        displayName: string
        emailAddress: string
        password?: string | undefined
    }

    export type DeleteAccount = {
        userId: string
    }
}


export interface UserAccountService {
    getAccountDetail(dto: UserAccountServiceArgs.GetAccountDetail): Promise<UserAccountResponse>
    updateAccountDetail(dto: UserAccountServiceArgs.UpdateAccountDetail): Promise<UserAccountResponse>
    deleteAccount(dto: UserAccountServiceArgs.DeleteAccount): Promise<void>
}
