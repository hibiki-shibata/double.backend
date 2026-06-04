
export class HttpException extends Error {
    constructor(
        override readonly message: string,
        public readonly statusCode: number = 500,
        public readonly code: string = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}