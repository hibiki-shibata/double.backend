// This should be replaced by zod like API validation libraries

// import type { Request } from "express"
// import type { UserLoginRequest, UserSignupRequest } from "../dto/userAuth.dto.js"
// import { InvalidInput } from "../../../shared/exception/httpException.js"

// export function toUserLoginRequest(
//     req: Request<{}, {}, UserLoginRequest>
// ): UserLoginRequest {
//     if (!req.body.userName || !req.body.password) throw new InvalidInput('Username or password can not be null')
//     return {
//         userName: req.body.userName,
//         password: req.body.password
//     }
// }

// export function toUserSignupRequest(
//     req: Request<{}, {}, UserSignupRequest>
// ): UserSignupRequest {
//     if (!req.body.userName || !req.body.password) throw new InvalidInput('Username or password can not be null')
//     return {
//         userName: req.body.userName,
//         password: req.body.password
//     }
// }