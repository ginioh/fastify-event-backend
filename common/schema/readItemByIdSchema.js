const S = require("fluent-json-schema");
const errorSchema = require("./errorSchema");

const readItemByIdSchema = (description, tags, querystring, itemSchema) => {
    return {
        description,
        tags,
        params: S.object()
            .additionalProperties(false)
            .prop("id", S.string().required()),
        querystring,
        response: {
            200: itemSchema,
            400: errorSchema,
            401: errorSchema
        }
    };
}

module.exports = readItemByIdSchema;