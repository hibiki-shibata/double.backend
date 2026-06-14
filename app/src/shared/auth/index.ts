import { jwtOptions } from "../config/security.config.js";
import type { JwtTokenService } from "./service/jwtToken.service.js";
import { JwtTokenServiceV1 } from "./service/jwtToken.service.v1.js";

export const jwtTokenService: JwtTokenService = new JwtTokenServiceV1(jwtOptions.secretKey)