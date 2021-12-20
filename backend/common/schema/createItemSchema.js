const S = require("fluent-json-schema");

const createItemSchema = function (description, tags, bodySchema, itemSchema) {
  return {
    description,
    tags,
    body: bodySchema,
    response: {
      200: S.object()
        .prop('item', itemSchema)
        .prop('message', S.string()),
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

module.exports = createItemSchema;