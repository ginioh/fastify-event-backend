class Exception {
    constructor(message, errorCode = "GENERIC_ERROR") {
        this.errorCode = errorCode;
        this.message = message;
    }
}