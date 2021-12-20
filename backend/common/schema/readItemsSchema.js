const S = require("fluent-json-schema");

const readItemsSchema = (description, tags, itemSchema) => {
    return {
        description,
        params: S.object()
            .prop("fields", S.string())
            .prop("sort", S.string())
            .prop("limit", S.number()),
        tags,
        response: {
            200: S.array().items(itemSchema),
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
        },
    };
}

module.exports = readItemsSchema;