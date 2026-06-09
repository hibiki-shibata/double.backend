// This should be replaced by zod like API validation libraries
import type { Request } from "express"
import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
import { InvalidInput } from "../../../shared/exception/httpException.js"
import type { UserAccountRequest } from "../dto/userAccount.dto.js"

export function UserLoginRequestValidation(
    req: Request<{}, {}, UserLoginRequest>
): UserLoginRequest {
    if (!req.body.userName || !req.body.password) throw new InvalidInput('Username or password can not be null')
    return {
        userName: req.body.userName,
        password: req.body.password
    }
}

export function UserSignupRequestValidation(
    req: Request<{}, {}, UserSignupRequest>
): UserSignupRequest {
    if (!req.body.userName || !req.body.password) throw new InvalidInput('Username or password can not be null')
    return {
        userName: req.body.userName,
        password: req.body.password
    }
}

export function UserAccountRequestValidation(
    req: Request<{}, {}, UserAccountRequest>
): UserAccountRequest {
    if (!req.body.name || !req.body.displayName || !req.body.emailAddress) throw new InvalidInput('Required field is missin in req body')
    return {
        name: req.body.name,
        displayName: req.body.displayName,
        emailAddress: req.body.emailAddress
    }
}