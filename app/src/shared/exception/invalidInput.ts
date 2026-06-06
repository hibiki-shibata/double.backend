import { HttpException } from "./httpException.js"

export class InvalidInput extends HttpException {
    constructor(message: string) {
        super(message, 400, 'BAD_REQUEST')
    }
}