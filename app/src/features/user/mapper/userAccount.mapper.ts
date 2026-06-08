import type { Request } from "express";
import type { User } from "../../../shared/infra/db/generated.prisma/client.js";
import type { UserAccountResponse, UserAccountRequest } from "../dto/userAccount.dto.js";
import { NotFound } from "../../../shared/exception/httpException.js"

export function toUserAccountRequest(
    req: Request
): UserAccountRequest {
    const userAccountRequest: UserAccountRequest = {
        id: req.accessTokenClaim.userId,
        name: 'string',
        display_name: 'string',
        email_address: 'string',
    }
    return userAccountRequest
}

export function toUserAccountResponse(
    user: User
): UserAccountResponse {
    if (!user.name || !user.email_address) throw new NotFound('Username or EmailAddress Not Found')
    const userAccountResponse: UserAccountResponse = {
        id: user.id,
        name: user.name ?? "unknow username",
        display_name: user.display_name,
        email_address: user.email_address ?? "unknown email address",
        status: user.status,
    }
    return userAccountResponse
}


