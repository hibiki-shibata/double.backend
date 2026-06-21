import type { JwtPayload } from "jsonwebtoken"
import type { JwtOptions } from "../../config/security.config.js"
import type { GenerateAccessTokenInput, GenerateRefreshTokenInput, JwtTokenService } from "./jwtToken.service.js"
import jwt from "jsonwebtoken"
import { type AccessTokenClaim, type RefreshTokenClaim, TokenType } from "../type/jwtToken.type.js"
import { UnauthenticatedErr } from "../../error/httpErrors.js"
import { UnexpectedEnvVarErr } from "../../error/serverErros.js"

export class JwtTokenServiceV1 implements JwtTokenService {
    private readonly jwt: typeof jwt = jwt
    constructor(
        private readonly jwtOptions: JwtOptions,
        private readonly generateTokenId: () => string,
    ) {
        if (!jwtOptions.secretKey.trim()) throw new UnexpectedEnvVarErr('Secret key is missing')
        if (jwtOptions.secretKey.length < jwtOptions.minSecretLen || jwtOptions.secretKey.length > jwtOptions.maxSecretLen) {
            throw new UnexpectedEnvVarErr(`secret key length must be between ${jwtOptions.minSecretLen} & ${jwtOptions.maxSecretLen}`)
        }
    }

    public generateAccessToken(dto: GenerateAccessTokenInput): string {
        const claim: AccessTokenClaim = {
            type: TokenType.accessToken,
            userId: dto.userId,
            userName: dto.userName,
            roles: dto.roles,
        }
        return this.jwt.sign(claim, this.jwtOptions.secretKey, {
            expiresIn: this.jwtOptions.accessTokenExpireIn,
            jwtid: this.generateTokenId(),
            algorithm: this.jwtOptions.algorithm,
            issuer: this.jwtOptions.issuer
        })
    }

    public generateRefreshToken(dto: GenerateRefreshTokenInput): string {
        const claim: RefreshTokenClaim = {
            type: TokenType.refreshToken,
            userId: dto.userId,
        }
        return this.jwt.sign(claim, this.jwtOptions.secretKey, {
            expiresIn: this.jwtOptions.refreshTokenExpireIn,
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
            const claim: JwtPayload | string = this.jwt.verify(token, this.jwtOptions.secretKey, {
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