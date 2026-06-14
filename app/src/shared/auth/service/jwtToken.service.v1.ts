import type { JwtTokenService } from "./jwtToken.service.js"
import type { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken"
import type { UserRoles } from "../../infra/db/generated.prisma/enums.js"
import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from "../type/jwtToken.type.js"
import { jwtOptions } from "../../config/security.config.js"
import { UnauthenticatedErr } from "../../error/httpErrors.js"
import { UnexpectedEnvVarErr } from "../../error/serverErros.js"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid'

export class JwtTokenServiceV1 implements JwtTokenService {

    constructor(
        private readonly secretKey: string
    ) {
        if (
            !secretKey ||
            secretKey.length < jwtOptions.minSecretLength ||
            secretKey.length > jwtOptions.maxSecretLength
        ) {
            throw new UnexpectedEnvVarErr(
                `JWT_SECRET_KEY must be between ${jwtOptions.minSecretLength} and ${jwtOptions.maxSecretLength} characters`
            )
        }
    }

    public generateAccessToken(userId: string, userName: string, roles: UserRoles[]): string {
        const claim: AccessTokenClaim = {
            type: TokenType.accessToken,
            userId: userId,
            userName: userName,
            roles: roles,
            iat: Date.now()
        }
        const signOptions: SignOptions = {
            expiresIn: jwtOptions.accessTokenExpiry,
            algorithm: jwtOptions.algorithm,
            issuer: jwtOptions.issuer,
        }
        return jwt.sign(claim, this.secretKey, signOptions)
    }

    public generateRefreshToken(userId: string): string {
        const claim: RefreshTokenClaim = {
            type: TokenType.refreshToken,
            tokenId: uuidv4(),
            userId: userId,
        }
        const signOptions: SignOptions = {
            expiresIn: jwtOptions.refreshTokenExpiry,
            algorithm: jwtOptions.algorithm,
            issuer: jwtOptions.issuer,
        }
        return jwt.sign(claim, this.secretKey, signOptions)
    }

    public verifyAccessToken(token: string): AccessTokenClaim {
        const payload: JwtPayload = this.verifyToken(token)
        if (payload.type !== TokenType.accessToken) throw new UnauthenticatedErr('Failed to get AccessToken')
        return payload as unknown as AccessTokenClaim
    }

    public verifyRefreshToken(token: string): RefreshTokenClaim {
        const payload: JwtPayload = this.verifyToken(token)
        if (payload.type !== TokenType.refreshToken) throw new UnauthenticatedErr('Failed to get RefreshToekn')
        return payload as unknown as RefreshTokenClaim
    }

    private verifyToken(token: string): JwtPayload {
        try {
            const verifyOptions: VerifyOptions = {
                issuer: jwtOptions.issuer,
                algorithms: [jwtOptions.algorithm]
            }
            const payload: JwtPayload | string = jwt.verify(token, this.secretKey, verifyOptions)
            if (typeof payload === 'string') throw new UnauthenticatedErr('Unexpected string payload')
            return payload
        } catch (err) {
            throw new UnauthenticatedErr('Invalid Jwt token')
        }
    }
}