// Doc: https://www.npmjs.com/package/express-rate-limit
import { type Options } from 'express-rate-limit'

export const rateLimitConfig: Partial<Options> = {
    windowMs: 10 * 60 * 1000,
    limit: 100, // req / windiwMs per IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // store: ... , // Note: Implement Redis later
}