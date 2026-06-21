import type { NextFunction, Request, Response } from "express";
import type { UserRoles } from "@global-shared/infra/db/generated.prisma/enums.js";
import { UnauthorizedErr } from "@global-shared/error/httpErrors.js";

export function authorize({ requiredRoles }: { requiredRoles: UserRoles[] }) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.accessTokenClaim) throw new UnauthorizedErr('Authentication required before authorization')

        const userRoles: UserRoles[] = req.accessTokenClaim.roles

        const hasRequiredRoles: boolean = requiredRoles.every((role) => userRoles.includes(role))
        if (!hasRequiredRoles) {
            throw new UnauthorizedErr('Unsufficient roles')
        }
        next()
    }
}