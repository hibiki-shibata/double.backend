import { HttpException } from "./httpException.js"

export class NotFound extends HttpException {
    constructor(
        message: string,
        statusCode = 404,
        code: 'NOT_FOUND'
    ) {
        super(
            message = message,
            statusCode = statusCode,
            code = code
        )
    }

}