export type UserSignupRequest = {
    userName: string,
    password: string,
}

export type UserLoginRequest = {
    userName: string,
    password: string,
}

export type AccessTokenResponse = {
    accessToken: string
}

export type RefreshTokenResponse = {
    refreshToken: string
}