class ValidationException extends Error {
    constructor(msg = "") {
        super();

        this.statusCode = 400;
        this.code = 'VALIDATION_ERROR';
        this.error = "Validation error";
        this.message = msg;
    }
}

module.exports = {
    ValidationException
}