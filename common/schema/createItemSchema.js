const S = require("fluent-json-schema");
const errorSchema = require("./errorSchema");

const createItemSchema = (description, tags, bodySchema, itemSchema) => {
  return {
    description,
    tags,
    // body: bodySchema,
    response: {
      200: S.object()
        .prop('item', itemSchema)
        .prop('message', S.string()),
      400: errorSchema,
      401: errorSchema,
    },
  };
}

module.exports = createItemSchema;