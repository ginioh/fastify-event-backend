const S = require("fluent-json-schema");

const updateItemByIdSchema = function (description, tags, bodySchema, itemSchema) {
  return {
    description,
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    body: bodySchema,
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("item", itemSchema)
        .prop("message", S.string().required()),
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
};

module.exports = updateItemByIdSchema;