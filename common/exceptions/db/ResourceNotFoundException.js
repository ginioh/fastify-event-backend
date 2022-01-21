class ResourceNotFoundException extends Error {
    constructor(msg = 'Item does not exists.') {
        super();

        this.statusCode = 404;
        this.code = 'RESOURCE_NOT_FOUND';
        this.message = msg;
    }
}

module.exports = {
    ResourceNotFoundException
}