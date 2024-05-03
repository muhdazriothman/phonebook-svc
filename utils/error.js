class ValidationError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.stack = (new Error()).stack;
    }
}

class BusinessLogicError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.stack = (new Error()).stack;
    }
}

class DatabaseError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.name = this.constructor.name;
        this.errorCode = errorCode;
        this.stack = (new Error()).stack;
    }
}

function resolveError(err) {
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred.';

    if (err instanceof ValidationError) {
        statusCode = 400;
        errorMessage = err.message;
    } else if (err instanceof BusinessLogicError) {
        statusCode = 409;
        errorMessage = err.message;
    } else if (err instanceof DatabaseError) {
        statusCode = 500;
        errorMessage = err.message;
    }
    
    console.log('error', err);

    return {
        statusCode: statusCode,
        body: JSON.stringify({
            message: errorMessage
        })        
    };
}

module.exports = {
    ValidationError,
    BusinessLogicError,
    DatabaseError,
    resolveError
};