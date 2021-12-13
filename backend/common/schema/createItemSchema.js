const S = require("fluent-json-schema");

module.exports = function (tags, bodySchema) {
  return {
    tags,
    body: bodySchema,
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("insertedId", S.string())
        .prop("message", S.string()),
    },
  };
}
