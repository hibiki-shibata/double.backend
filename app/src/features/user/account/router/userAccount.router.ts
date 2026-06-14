import { Router } from 'express'
import { UserAccountController } from '../controller/userAccount.controller.js'
import { validateRequestBody } from '../../../../shared/middleware/validateRequestBody.js'
import { userAccountRequestSchema } from '../dto/userAccount.dto.js'

export class UserAccountRouter {
    public readonly router: Router = Router()
    constructor(
        private readonly controller: UserAccountController
    ) { }
    create(): Router {
        this.router.get('/me', this.controller.getMyAccount)
        this.router.put('/me', validateRequestBody(userAccountRequestSchema), this.controller.updateMyAccount)
        this.router.delete('/me', this.controller.deleteMyAccount)
        return this.router
    }
}