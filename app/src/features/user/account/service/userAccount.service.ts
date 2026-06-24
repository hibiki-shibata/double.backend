import type { UserAccountResponse } from "../schema/userAccount.schema.js"

export namespace UserAccountServiceParams {
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
    getAccountDetail(dto: UserAccountServiceParams.GetAccountDetail): Promise<UserAccountResponse>
    updateAccountDetail(dto: UserAccountServiceParams.UpdateAccountDetail): Promise<UserAccountResponse>
    deleteAccount(dto: UserAccountServiceParams.DeleteAccount): Promise<void>
}
