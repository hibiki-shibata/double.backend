import type { User } from "../../../shared/infra/db/generated.prisma/client.js";
import type { UserAccountResponse } from "../dto/userAccount.dto.js";
import { NotFound } from "../../../shared/exception/httpException.js"

export function toUserAccountResponse(
    user: User
): UserAccountResponse {
    if (!user.name || !user.email_address) throw new NotFound('Username or EmailAddress Not Found')
    const userAccountResponse: UserAccountResponse = {
        id: user.id,
        name: user.name,
        displayName: user.display_name,
        emailAddress: user.email_address,
        status: user.status,
    }
    return userAccountResponse
}


