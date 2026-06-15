import type { JwtTokenService } from "./service/jwtToken.service.js"
import { JwtTokenServiceV1 } from "../auth/service/jwtToken.service.v1.js"
import { jwtOptions } from "../config/security.config.js"
import { v4 as uuidv4 } from "uuid"

export const jwtTokenService: JwtTokenService = new JwtTokenServiceV1(jwtOptions, uuidv4)