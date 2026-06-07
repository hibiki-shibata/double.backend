import "dotenv/config"
import { type Options } from 'express-rate-limit'

export const rateLimitConfig: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    limit: parseInt(process.env.RATE_LIMIT ?? '', 10), // 100 req/ 15 mins
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    // store: ... , // Note: Implement Redis later
}