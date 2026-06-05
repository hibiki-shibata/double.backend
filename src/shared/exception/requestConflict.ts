import { HttpException } from "./httpException.js"

export class RequestConflict extends HttpException {
    constructor(message: string) {
        super(message, 409, 'REQUEST_CONFLICT')
    }
}