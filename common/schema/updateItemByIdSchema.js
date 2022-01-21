const S = require("fluent-json-schema");
const errorSchema = require("./errorSchema");

const updateItemByIdSchema = function (description, tags, bodySchema, itemSchema) {
  return {
    description,
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    // body: bodySchema,
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("item", itemSchema)
        .prop("message", S.string().required()),
      400: errorSchema,
      401: errorSchema
    },
  };
};

module.exports = updateItemByIdSchema;