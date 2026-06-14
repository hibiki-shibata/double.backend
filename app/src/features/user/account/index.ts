import type { Router } from "express"
import type { UserRepository } from "../shared/repository/user.repository.js"
import type { UserAccountService } from "./service/userAccount.service.js"
import { PrismaUserRepository } from "../shared/repository/prisma.user.repository.js"
import { UserAccountServiceV1 } from "./service/userAccount.service.v1.js"
import { UserAccountController } from "./controller/userAccount.controller.js"
import { createUserAccountRouter } from "./router/userAccount.router.js"

const repository: UserRepository = new PrismaUserRepository()
const service: UserAccountService = new UserAccountServiceV1(repository)
const controller = new UserAccountController(service)

export const userAccountRouter: Router = createUserAccountRouter(controller)