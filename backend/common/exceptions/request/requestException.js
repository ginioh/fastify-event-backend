class RequestException extends Exception {
    constructor(message) {
        this.super(message, 'REQUEST_EXCEPTION');
    }
}