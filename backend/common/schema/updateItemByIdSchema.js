const S = require("fluent-json-schema");

module.exports = function (tags, bodySchema, itemSchema) {
  return {
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    body: bodySchema,
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("data", itemSchema)
        .prop("message", S.string().required()),
    },
  };
};
