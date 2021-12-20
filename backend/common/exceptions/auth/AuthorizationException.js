class AuthorizationException extends Error {
    constructor(error) {
        super();

        this.statusCode = 401;
        this.code = 'AUTHORIZATION_ERROR';
        this.message = error;
    }
}

module.exports = {
    AuthorizationException
}