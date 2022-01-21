const S = require("fluent-json-schema");

module.exports = S.object()
    .prop('fields', S.string())
    .prop('limit', S.number())
    .prop('offset', S.number())
    .prop('sort', S.string())