import type { JwtTokenService } from "./jwtToken.service.js"
import type { UserRoles } from "../../infra/db/generated.prisma/enums.js"
import type { JwtOptions } from "../../config/security.config.js"
import type { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from "../type/jwtToken.type.js"
import { UnauthenticatedErr } from "../../error/httpErrors.js"
import { UnexpectedEnvVarErr } from "../../error/serverErros.js"

export class JwtTokenServiceV1 implements JwtTokenService {
    constructor(
        private readonly jwtOptions: JwtOptions,
        private readonly generateTokenId: () => string
    ) {
        if (!jwtOptions.secretKey.trim()) throw new UnexpectedEnvVarErr('Secret key is missing')
        if (jwtOptions.secretKey.length < jwtOptions.minSecretLength || jwtOptions.secretKey.length > jwtOptions.maxSecretLength) {
            throw new UnexpectedEnvVarErr(`secret key length must be between ${jwtOptions.minSecretLength} & ${jwtOptions.maxSecretLength}`)
        }
    }

    public generateAccessToken(userId: string, userName: string, roles: UserRoles[]): string {
        const claim: AccessTokenClaim = {
            type: TokenType.accessToken,
            userId: userId,
            userName: userName,
            roles: roles,
        }
        return jwt.sign(claim, this.jwtOptions.secretKey, {
            expiresIn: this.jwtOptions.accessTokenExpiry,
            jwtid: this.generateTokenId(),
            algorithm: this.jwtOptions.algorithm,
            issuer: this.jwtOptions.issuer
        })
    }

    public generateRefreshToken(userId: string): string {
        const claim: RefreshTokenClaim = {
            type: TokenType.refreshToken,
            userId: userId,
        }
        return jwt.sign(claim, this.jwtOptions.secretKey, {
            expiresIn: this.jwtOptions.refreshTokenExpiry,
            jwtid: this.generateTokenId(),
            algorithm: this.jwtOptions.algorithm,
            issuer: this.jwtOptions.issuer,
        })
    }

    public verifyAccessToken(token: string): AccessTokenClaim {
        const claim: JwtPayload = this.verifyToken(token)
        if (claim.type !== TokenType.accessToken) throw new UnauthenticatedErr('Failed to get AccessToken')
        return claim as unknown as AccessTokenClaim
    }

    public verifyRefreshToken(token: string): RefreshTokenClaim {
        const claim: JwtPayload = this.verifyToken(token)
        if (claim.type !== TokenType.refreshToken) throw new UnauthenticatedErr('Failed to get RefreshToekn')
        return claim as unknown as RefreshTokenClaim
    }

    private verifyToken(token: string): JwtPayload {
        try {
            const claim: JwtPayload | string = jwt.verify(token, this.jwtOptions.secretKey, {
                issuer: this.jwtOptions.issuer,
                algorithms: [this.jwtOptions.algorithm],
            })
            if (typeof claim === 'string') throw new UnauthenticatedErr('Unexpected string payload')
            return claim
        } catch (err) {
            if (err instanceof UnauthenticatedErr) throw new UnauthenticatedErr(`${err}`)
            throw new UnauthenticatedErr('Unknow jwtoken verification error')
        }
    }
}