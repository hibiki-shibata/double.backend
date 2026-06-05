import { HttpException } from "./httpException.js"

export class Timeout extends HttpException {
    constructor(message: string) {
        super(message, 408, 'REQUEST_CONFLICT')
    }
}