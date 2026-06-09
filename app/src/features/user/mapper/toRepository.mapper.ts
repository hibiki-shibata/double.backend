import { MappingError } from "../../../shared/exception/serverException.js";
import { UserRoles, UserStatus } from "../../../shared/infra/db/generated.prisma/enums.js";
import type { UserCreateInput, UserUpdateInput } from "../../../shared/infra/db/generated.prisma/models.js";
import type { UserAccountRequest } from "../dto/userAccount.dto.js";
import type { UserSignupRequest } from "../dto/userAuth.dto.js";


export function toDBUserUpdateInput(user: UserAccountRequest): UserUpdateInput {
    if (!user.displayName || !user.emailAddress || !user.name) throw new MappingError('Required parammeters can not be null')
    return {
        name: user.name,
        display_name: user.displayName,
        email_address: user.emailAddress,
    }
}

export function toDBUserCreateInput(hashedPassword: string, user: UserSignupRequest): UserCreateInput {
    if (!user.userName || !user.password || !hashedPassword) throw new MappingError('Required parammeters can not be null')
    return {
        name: user.userName,
        display_name: '(New)' + user.userName,
        password_hash: hashedPassword,
        status: UserStatus.active,
        roles: [UserRoles.user],
    }
}

