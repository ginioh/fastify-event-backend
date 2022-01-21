const S = require("fluent-json-schema");

module.exports = S.object()
    .prop('statusCode', S.number())
    .prop('code', S.string())
    .prop('error', S.string())
    .prop('message', S.string())