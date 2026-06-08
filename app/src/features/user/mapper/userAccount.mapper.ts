import type { Request } from "express";
import type { User } from "../../../shared/infra/db/generated.prisma/client.js";
import type { UserAccountResponse, UserAccountRequest, UpdateUserAccountDTO } from "../dto/userAccount.dto.js";
import { NotFound } from "../../../shared/exception/httpException.js"


export function toUpdateUserAccountDTO(
    req: Request<{}, {}, UserAccountRequest>
): UpdateUserAccountDTO {
    if (!req.body.name || !req.body.display_name || !req.body.email_address) throw new NotFound('Required field are missing')
    const userAccountRequest: UpdateUserAccountDTO = {
        userId: req.accessTokenClaim.userId,
        userName: req.body.name,
        displayName: req.body.display_name,
        emailAddress: req.body.email_address,
    }
    return userAccountRequest
}

export function toUserAccountResponse(
    user: User
): UserAccountResponse {
    if (!user.name || !user.email_address) throw new NotFound('Username or EmailAddress Not Found')
    const userAccountResponse: UserAccountResponse = {
        id: user.id,
        name: user.name,
        display_name: user.display_name,
        email_address: user.email_address,
        status: user.status,
    }
    return userAccountResponse
}


