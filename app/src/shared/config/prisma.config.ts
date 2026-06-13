// import type { PrismaPgOptions } from "@prisma/adapter-pg";

import type { PoolConfig } from "pg"

export const prismaAdapterConfig: PoolConfig = { connectionString: process.env.DATABASE_URL }