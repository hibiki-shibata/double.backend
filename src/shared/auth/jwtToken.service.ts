export const JwtTokenService = {
    getJwtAuthToken() { },
    isTokenValid(token: string) {
        PrivateJwtService.isTokenExpired(token)
    },
    getAccessTokenClaim() { },
    getRegreshTokenClaim() { },
}

const PrivateJwtService = {
    generateAccessToken() { },
    generateRefreshToken() { },
    isTokenExpired(token: string): boolean { return token ? true : false },
    extractTokenClaim() { },
}