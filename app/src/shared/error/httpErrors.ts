export class HttpBaseErr extends Error {
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

export class InvalidInputErr extends HttpBaseErr {
    constructor(message: string) {
        super(message, 400, 'BAD_REQUEST')
    }
}

export class NotFoundErr extends HttpBaseErr {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND')
    }
}

export class ConflictErr extends HttpBaseErr {
    constructor(message: string) {
        super(message, 409, 'REQUEST_CONFLICT')
    }
}

export class TimeoutErr extends HttpBaseErr {
    constructor(message: string) {
        super(message, 408, 'REQUEST_CONFLICT')
    }
}

export class UnauthorizedErr extends HttpBaseErr {
    constructor(message: string) {
        super(message, 401, 'UNAUTHORIZED')
    }
}


export class UnauthenticatedErr extends HttpBaseErr {
    constructor(message: string) {
        super(message, 403, 'UNAUTHENTICATED')
    }
}