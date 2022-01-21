const S = require("fluent-json-schema");

const paginatedResponseSchema = (itemSchema) => S.object()
    .prop('docs', S.array().items(itemSchema))
    .prop('totalDocs', S.number())
    .prop('offset', S.number())
    .prop('limit', S.number())
    .prop('totalPages', S.number())
    .prop('page', S.number())
    .prop('pagingCounter', S.number())
    .prop('hasPrevPage', S.boolean())
    .prop('hasNextPage', S.boolean())
    .prop('prevPage', S.number())
    .prop('nextPage', S.number())

module.exports = paginatedResponseSchema;