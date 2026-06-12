import { MappingError } from "../../../../shared/exception/serverException.js"
import { type User } from "../../../../shared/infra/db/generated.prisma/client.js"
import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from "../../../../shared/auth/jwtToken.type.js"
import { v4 as uuidv4 } from 'uuid'

export function toAccessTokenClaim(user: User): AccessTokenClaim {
    if (
        !user.id ||
        !user.name ||
        !user.roles
    ) {
        throw new MappingError('Found user is missing username')
    }
    return {
        type: TokenType.accessToken,
        userId: user.id,
        userName: user.name,
        roles: user.roles,
        iat: Date.now()
    }
}

export function toRefreshTokenClaim(user: User): RefreshTokenClaim {
    if (
        !user.id ||
        !user.name ||
        !user.roles
    ) {
        throw new MappingError('Found user is missing username')
    }
    return {
        userId: user.id,
        type: TokenType.refreshToken,
        tokenId: uuidv4()
    }
}