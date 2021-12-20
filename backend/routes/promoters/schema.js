"use strict";

const S = require("fluent-json-schema");
const {
  createItemSchema,
  deleteItemSchema,
  updateItemByIdSchema,
  readItemsSchema,
  readItemByIdSchema,
} = require("../../common/schema");

const promoterSchema = S.object()
  .additionalProperties(false)
  .prop("_id", S.string())
  .prop("name", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string())
  .prop("email", S.string())
  .prop("logo", S.string());

const tags = ["promoter"];

const bodyCreateJsonSchema = S.object()
  .prop("name", S.string().required())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string().required())
  .prop("email", S.string().required())
  .prop("logo", S.string().required());

const bodyUpdateJsonSchema = promoterSchema.only([
  "name",
  "slug",
  "description",
  "website",
  "email",
  "logo",
]);

const readPromotersSchema = readItemsSchema("Read all promoters.", tags, promoterSchema)

const readPromoterByIdSchema = readItemByIdSchema("Read a single existing promoter, given id.", tags, promoterSchema)

const createPromoterSchema = createItemSchema("Create a new promoter.", tags, bodyCreateJsonSchema);

const updatePromoterSchema = updateItemByIdSchema("Update an existing promoter, given id.",
  tags,
  bodyUpdateJsonSchema,
  promoterSchema
);

const deletePromoterSchema = deleteItemSchema("Read all events.", tags);

module.exports = {
  promoterSchema,
  readPromotersSchema,
  readPromoterByIdSchema,
  createPromoterSchema,
  updatePromoterSchema,
  deletePromoterSchema,
};
