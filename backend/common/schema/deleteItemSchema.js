const S = require("fluent-json-schema");

module.exports = function (tags) {
  return {
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("message", S.string().required()),
    },
  };
}
