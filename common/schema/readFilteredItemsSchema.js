const S = require("fluent-json-schema");
const paginatedResponseSchema = require("./paginatedResponseSchema");
const errorSchema = require("./errorSchema");
const baseFiltersSchema = require("./baseFiltersSchema");

const readFilteredItemsSchema = (description, tags, querystring, itemSchema) => {
    return {
        description,
        querystring: baseFiltersSchema.extend(querystring),
        tags,
        response: {
            200: paginatedResponseSchema(itemSchema),
            400: errorSchema,
            401: errorSchema
        },
    };
}

module.exports = readFilteredItemsSchema;