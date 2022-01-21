const S = require("fluent-json-schema");
const errorSchema = require("./errorSchema");

const deleteItemSchema = (description, tags) => {
  return {
    description,
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("message", S.string().required()),
      400: errorSchema,
      401: errorSchema
    },
  };
}

module.exports = deleteItemSchema;