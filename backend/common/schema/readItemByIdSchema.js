const S = require("fluent-json-schema");

const readItemByIdSchema = (description, tags, itemSchema) => {
    return {
        description,
        tags,
        params: S.object()
            .additionalProperties(false)
            .prop("id", S.string().required())
            .prop("fields", S.string()),
        response: {
            200: itemSchema,
            400: S.object()
                .prop('statusCode', S.number())
                .prop('code', S.string())
                .prop('error', S.string())
                .prop('message', S.string()),
            401: S.object()
                .prop('statusCode', S.number())
                .prop('code', S.string())
                .prop('error', S.string())
                .prop('message', S.string()),
        }
    };
}

module.exports = readItemByIdSchema;