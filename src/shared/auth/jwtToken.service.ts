import { NotFound } from "../exception/notFound.js"
import type { JwtTokenResponse } from "./jwtToken.type.js"

class JwtTokenService {
    public getJwtAuthToken(): JwtTokenResponse {
        const freshJwtToken: JwtTokenResponse = {
            accessToken: 'example',
            refreshToken: 'example'
        }
        return freshJwtToken
    }

    public isTokenValid(token: string): boolean {
        return this.isTokenExpired(token)
    }

    public getAccessTokenClaim() {
        // Implement later
    }

    public getRefreshTokenClaim() {
        // Implement later
    }


    private generateAccessToken() {
        // Implement later
    }

    private generateRefreshToken() {
        // Implement later
    }

    private isTokenExpired(token: string): boolean {
        return token ? true : false
    }

    private extractTokenClaim() {
        // Implement later
    }

    private getSecret(): string {
        const secret: string = process.env.JWT_SECRET_KEY ?? ''
        if (!secret) throw new NotFound('JWT token secret')
        return secret
    }
}

export const JWtTokenService = new JwtTokenService