import type { User } from "../../../shared/infra/db/generated.prisma/client.js";
import type { UserAccountResponse } from "../dto/userAccount.dto.js";
import { MappingError } from "../../../shared/exception/serverException.js";

export function toUserAccountResponse(
    user: User
): UserAccountResponse {
    if (
        !user.name ||
        !user.display_name ||
        !user.email_address ||
        !user.email_address ||
        !user.status
    ) {
        throw new MappingError('Mapping to Response failed - required field is missing')
    }
    return {
        id: user.id,
        name: user.name,
        displayName: user.display_name,
        emailAddress: user.email_address,
        status: user.status,
    }
}