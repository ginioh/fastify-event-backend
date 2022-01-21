const S = require("fluent-json-schema");
const errorSchema = require("./errorSchema");

const readItemsSchema = (description, tags, querystring, itemSchema) => {
    return {
        description,
        querystring,
        tags,
        response: {
            200: S.array().items(itemSchema),
            400: errorSchema,
            401: errorSchema
        },
    };
}

module.exports = readItemsSchema;