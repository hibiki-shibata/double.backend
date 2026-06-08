import { JwtTokenService } from "./service/jwtToken.service.js"
import { PasswordService } from "./service/password.service.js"
import { jwtConfig, passwordEncoderConfig } from "../config/security.config.js"

export const jwtTokenService = new JwtTokenService(jwtConfig.secretKey)
export const passwordService = new PasswordService(passwordEncoderConfig.saltRound)