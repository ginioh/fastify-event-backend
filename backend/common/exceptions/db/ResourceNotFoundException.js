class ResourceNotFoundException extends Error {
    constructor(error) {
        super();

        this.statusCode = 404;
        this.code = 'RESOURCE_NOT_FOUND';
        this.message = 'Item does not exists.';
    }
}

module.exports = {
    ResourceNotFoundException
}