"use strict";

const S = require("fluent-json-schema");
const {
  createItemSchema,
  deleteItemSchema,
  updateItemByIdSchema,
} = require("../../common/schema");

const promoterSchema = S.object()
  .prop("name", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string())
  .prop("email", S.string())
  .prop("logo", S.string());

const tags = ["eventManager"];

const bodyCreateJsonSchema = S.object()
  .prop("name", S.string().required())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string())
  .prop("email", S.string().required())
  .prop("logo", S.string());

const bodyUpdateJsonSchema = promoterSchema.only([
  "name",
  "slug",
  "description",
  "website",
  "email",
  "logo",
]);

const readPromotersSchema = {
  description: "Read all promoters.",
  params: S.object()
    .prop("fields", S.string())
    .prop("sort", S.string())
    .prop("limit", S.number()),
  tags,
  response: {
    200: S.array().items(promoterSchema),
  },
};

const readPromoterByIdSchema = {
  tags,
  params: S.object()
    .additionalProperties(false)
    .prop("id", S.string().required())
    .prop("fields", S.string()),
};

const createPromoterSchema = createItemSchema(tags, bodyCreateJsonSchema);

const updatePromoterSchema = updateItemByIdSchema(
  tags,
  bodyUpdateJsonSchema,
  promoterSchema
);

const deletePromoterSchema = deleteItemSchema(tags);

module.exports = {
  promoterSchema,
  readPromotersSchema,
  readPromoterByIdSchema,
  createPromoterSchema,
  updatePromoterSchema,
  deletePromoterSchema,
};
