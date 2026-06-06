export class HttpBaseException extends Error {
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

export class InvalidInput extends HttpBaseException {
    constructor(message: string) {
        super(message, 400, 'BAD_REQUEST')
    }
}


export class NotFound extends HttpBaseException {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND')
    }
}

export class RequestConflict extends HttpBaseException {
    constructor(message: string) {
        super(message, 409, 'REQUEST_CONFLICT')
    }
}

export class Timeout extends HttpBaseException {
    constructor(message: string) {
        super(message, 408, 'REQUEST_CONFLICT')
    }
}

export class Unauthorized extends HttpBaseException {
    constructor(message: string) {
        super(message, 401, 'UNAUTHORIZED')
    }
}


export class Unauthenticated extends HttpBaseException {
    constructor(message: string) {
        super(message, 403, 'UNAUTHENTICATED')
    }
}