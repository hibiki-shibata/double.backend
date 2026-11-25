import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    // Runtime Environment
    NODE_ENV: z.enum(['dev', 'prod', 'stage']).default('dev'),
    APP_ENV: z.enum(['local', 'stage', 'production']).default('local'),
    PORT: z.coerce.number().int().positive().default(3000),

    // Database (Required - Fail Fast)
    DATABASE_URL: z.string(),

    // Redis (Safe local defaults, password required in staging/prod)
    REDIS_HOST: z.string().min(1).default('localhost'),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_USERNAME: z.string().min(1).default('default'),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().int().min(0).max(15).default(0),

    // Logger
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

    // Security
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
    JWT_SECRET_KEY: z.string().min(32).max(70),
    CORS_ORIGINS: z.string().min(1), // e.g. "http://localhost:3000,http://localhost:5173"
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
}).superRefine((data, ctx) => {
    // Cross-field production rule: require Redis password outside local dev
    if (data.APP_ENV !== 'local' && !data.REDIS_PASSWORD) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['REDIS_PASSWORD'],
            message: 'REDIS_PASSWORD is required when APP_ENV is staging or production',
        })
    }
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
    process.exit(1)
}

export const env = Object.freeze(parsed.data)

export const isDevMode = env.NODE_ENV === 'dev'
export const isProdMode = env.NODE_ENV === 'prod'
export const isStageMode = env.APP_ENV === 'stage'