import jwt from 'jsonwebtoken'
import type { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken"
import { type JwtTokenResponse, type AccessTokenClaim, type RefreshTokenClaim, TokenType } from "./jwtToken.type.js"
import { UnAuthorized } from "../exception/unAuthorized.js"
import { jwtConfig } from '../config/jwt.config.js'

class JwtTokenService {

    getFreshTokens(
        accessTokenClaim: AccessTokenClaim,
        refreshTokenClaim: RefreshTokenClaim,
    ): JwtTokenResponse {
        const freshJwtTokens: JwtTokenResponse = {
            accessToken: this.generateAccessToken(accessTokenClaim),
            refreshToken: this.generateRefreshToken(refreshTokenClaim),
        }
        return freshJwtTokens
    }

    getAccessTokenClaim(token: string): AccessTokenClaim {
        const payload: JwtPayload = this.verifyToken(token)
        if (payload.type !== TokenType.accessToken) throw new UnAuthorized('Failed to get AccessToken')
        return payload as unknown as AccessTokenClaim
    }

    getRefreshTokenClaim(token: string): RefreshTokenClaim {
        const payload: JwtPayload = this.verifyToken(token)
        if (payload.type !== TokenType.refreshToken) throw new UnAuthorized('Failed to get RefreshToekn')
        return payload as unknown as RefreshTokenClaim
    }

    private verifyToken(token: string): JwtPayload {
        const verifyOptions: VerifyOptions = {
            issuer: jwtConfig.issuer,
            algorithms: [jwtConfig.algorithm]
        }
        try {
            const payload: JwtPayload | string = jwt.verify(token, this.getSecret(), verifyOptions)
            if (typeof payload === 'string') throw new Error('Unexpected string payload')
            return payload

        } catch (err) {
            throw new UnAuthorized('Invalid Jwt token')
        }
    }

    private generateAccessToken(claim: AccessTokenClaim): string {
        const signOptions: SignOptions = {
            expiresIn: jwtConfig.accessTokenExpiry,
            algorithm: jwtConfig.algorithm,
            issuer: jwtConfig.issuer,
        }
        return jwt.sign(claim, this.getSecret(), signOptions)
    }

    private generateRefreshToken(claim: RefreshTokenClaim): string {
        const signOptions: SignOptions = {
            expiresIn: jwtConfig.refreshTokenExpiry,
            algorithm: jwtConfig.algorithm,
            issuer: jwtConfig.issuer,
        }
        return jwt.sign(claim, this.getSecret(), signOptions)
    }

    private getSecret(): string {
        const secret = process.env.JWT_SECRET_KEY ?? ''
        if (!secret) throw new Error('JWT_SECRET_KEY environment variable is not set')
        if (secret.length < 32) throw new Error('JWT_SECRET_KEY must be at least 32 characters')
        return secret
    }
}

export const jwtTokenService = new JwtTokenService()