import { HttpException } from "./httpException.js"

export class UnAuthorized extends HttpException {
    constructor(message: string) {
        super(message, 401, 'UNAUTHORIZED')
    }
}