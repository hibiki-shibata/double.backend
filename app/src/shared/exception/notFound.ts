import { HttpException } from "./httpException.js"

export class NotFound extends HttpException {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND')
    }
}