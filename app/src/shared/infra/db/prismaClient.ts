import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated.prisma/client.js"
import { prismaAdapterConfig } from "../../config/db.config.js"

const adapter = new PrismaPg(prismaAdapterConfig)
export const prismaClient = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
})
