import type { Request } from "express"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"

export function toUserLoginRequest(req: Request): UserLoginRequest {
    return {
        userName: 'string;',
        password: 'string;',
    }
}

export function toUserSignupRequest(req: Request): UserSignupRequest {
    return {
        userName: 'string;',
        password: 'string;'
    }
}