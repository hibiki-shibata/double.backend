// import type { Request, Response, NextFunction } from "express"
// import { InvalidInputErr } from "../error/httpErrors.js"
// import type { ZodObject } from "zod"

// export function verifyParams(schema: ZodObject) {
//     return (req: Request, _res: Response, next: NextFunction) => {
//         const result = schema.safeParse(req.params)

//         if (!result.success) {
//             throw new InvalidInputErr(`Invalid Request Body\n${result.error}`)
//         }

//         req.params = result.data as typeof req.params
//         next()
//     }
// }
