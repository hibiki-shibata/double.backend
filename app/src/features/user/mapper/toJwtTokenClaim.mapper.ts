import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from "../../../shared/auth/type/jwtToken.type.js"
import { NotFound } from "../../../shared/exception/httpException.js"
import { type User } from "../../../shared/infra/db/generated.prisma/client.js"
import { v4 as uuidv4 } from 'uuid'

export function toAccessTokenClaim(user: User): AccessTokenClaim {
    if (!user.name) throw new NotFound('Found user is missing username')
    return {
        type: TokenType.accessToken,
        userId: user.id,
        userName: user.name,
        roles: user.roles,
        iat: Date.now()
    }
}

export function toRefreshTokenClaim(user: User): RefreshTokenClaim {
    return {
        type: TokenType.refreshToken,
        tokenId: uuidv4(),
        userId: user.id
    }
}