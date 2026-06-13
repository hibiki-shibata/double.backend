import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated.prisma/client.js"
import { prismaAdapterConfig } from "../../config/prisma.config.js"

const adapter = new PrismaPg(prismaAdapterConfig)
const prisma = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"],
})

export { prisma }