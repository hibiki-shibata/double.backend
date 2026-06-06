// Doc: https://www.npmjs.com/package/express-rate-limit
import { type Options } from 'express-rate-limit'

export const rateLimitConfig: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT) ?? 100, // 100 req/ 15 mins
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // store: ... , // Note: Implement Redis later
}