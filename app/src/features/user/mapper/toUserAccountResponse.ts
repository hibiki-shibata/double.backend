import type { User } from "../../../shared/infra/db/generated.prisma/client.js";
import type { UserAccountResponse } from "../dto/userAccount.dto.js";
import { NotFound } from "../../../shared/exception/httpException.js"

export function toUserAccountResponse(
    user: User
): UserAccountResponse {
    if (!user.name || !user.email_address) throw new NotFound('Username or Email Address not found')
    const userAccountResponse: UserAccountResponse = {
        id: user.id,
        name: user.name ?? "unknow username",
        display_name: user.display_name,
        email_address: user.email_address ?? "unknown email address",
        status: user.status,
    }
    return userAccountResponse
}