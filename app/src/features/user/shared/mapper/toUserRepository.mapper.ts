// import type { UserCreateInput, UserUpdateInput } from "../../../shared/infra/db/generated.prisma/models.js";
// import { UserRoles, UserStatus } from "../../../shared/infra/db/generated.prisma/enums.js";
// import { MappingError } from "../../../shared/exception/serverException.js";
// import type { UserAccountRequest } from "../account/dto/userAccount.dto.js";
// import type { UserSignupRequest } from "../auth/dto/userAuth.dto.js";

// export function toUpdateUser(
//     user: UserAccountRequest
// ): UserUpdateInput {
//     if (!user.displayName || !user.emailAddress || !user.name) throw new MappingError('Required parammeters can not be null')
//     return {
//         name: user.name,
//         display_name: user.displayName,
//         email_address: user.emailAddress,
//     }
// }

// export function toCreateUser(
//     hashedPassword: string,
//     user: UserSignupRequest
// ): UserCreateInput {
//     if (!user.userName || !user.password || !hashedPassword) throw new MappingError('Required parammeters can not be null')
//     return {
//         name: user.userName,
//         display_name: '(New)' + user.userName,
//         password_hash: hashedPassword,
//         status: UserStatus.active,
//         roles: [UserRoles.user],
//     }
// }

