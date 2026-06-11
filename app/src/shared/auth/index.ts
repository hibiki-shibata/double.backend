import { JwtTokenService } from "./service/jwtToken.service.js"
import { PasswordService } from "./service/password.service.js"
import { jwtOptions, passwordEncoderOptions } from "../config/security.config.js"

export const jwtTokenService = new JwtTokenService(jwtOptions.secretKey)
export const passwordService = new PasswordService(passwordEncoderOptions.saltRound)