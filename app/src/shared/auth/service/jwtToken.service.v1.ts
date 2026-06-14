import type { JwtTokenService } from "./jwtToken.service.js"
import type { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { jwtOptions } from "../../config/security.config.js"
import { TokenType, type AccessTokenClaim, type RefreshTokenClaim } from "../type/jwtToken.type.js"
import { Unauthenticated } from "../../exception/httpException.js"
import { UnexpectedEnvVar } from "../../exception/serverException.js"

export class JwtTokenServiceV1 implements JwtTokenService {

    constructor(private readonly secretKey: string) {
        if (
            !secretKey ||
            secretKey.length < jwtOptions.minSecretLength ||
            secretKey.length > jwtOptions.maxSecretLength
        ) {
            throw new UnexpectedEnvVar(
                `JWT_SECRET_KEY must be between ${jwtOptions.minSecretLength} and ${jwtOptions.maxSecretLength} characters`
            )
        }
    }

    public generateAccessToken(claim: AccessTokenClaim): string {
        const signOptions: SignOptions = {
            expiresIn: jwtOptions.accessTokenExpiry,
            algorithm: jwtOptions.algorithm,
            issuer: jwtOptions.issuer,
        }
        return jwt.sign(claim, this.secretKey, signOptions)
    }

    public generateRefreshToken(claim: RefreshTokenClaim): string {
        const signOptions: SignOptions = {
            expiresIn: jwtOptions.refreshTokenExpiry,
            algorithm: jwtOptions.algorithm,
            issuer: jwtOptions.issuer,
        }
        return jwt.sign(claim, this.secretKey, signOptions)
    }

    public verifyAccessToken(token: string): AccessTokenClaim {
        const payload: JwtPayload = this.verifyToken(token)
        if (payload.type !== TokenType.accessToken) throw new Unauthenticated('Failed to get AccessToken')
        return payload as unknown as AccessTokenClaim
    }

    public verifyRefreshToken(token: string): RefreshTokenClaim {
        const payload: JwtPayload = this.verifyToken(token)
        if (payload.type !== TokenType.refreshToken) throw new Unauthenticated('Failed to get RefreshToekn')
        return payload as unknown as RefreshTokenClaim
    }

    private verifyToken(token: string): JwtPayload {
        try {
            const verifyOptions: VerifyOptions = {
                issuer: jwtOptions.issuer,
                algorithms: [jwtOptions.algorithm]
            }
            const payload: JwtPayload | string = jwt.verify(token, this.secretKey, verifyOptions)
            if (typeof payload === 'string') throw new Unauthenticated('Unexpected string payload')
            return payload
        } catch (err) {
            throw new Unauthenticated('Invalid Jwt token')
        }
    }
}