import type { PoolConfig } from "pg"
import { env, isProdMode } from "./env.js"

export const prismaAdapterConfig: PoolConfig = {
    connectionString: env.DATABASE_URL,
    max: isProdMode ? 20 : 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
}