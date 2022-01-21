"use strict";

const S = require("fluent-json-schema");
const {
  createItemSchema,
  deleteItemSchema,
  updateItemByIdSchema,
  readItemsSchema,
  readItemByIdSchema,
  readFilteredItemsSchema,
} = require("../../common/schema");

const promoterSchema = S.object()
  .additionalProperties(false)
  .prop("_id", S.string())
  .prop("name", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string().format(S.FORMATS.URL))
  .prop("email", S.string().format(S.FORMATS.EMAIL))
  .prop("logo", S.string());

const tags = ["Promoter"];

const bodyCreateJsonSchema = S.object()
.additionalProperties(false)
.prop("name", S.string().required())
.prop("description", S.string())
.prop("website", S.string().format(S.FORMATS.URL).required())
.prop("email", S.string().format(S.FORMATS.EMAIL).required())
.prop("logo", S.string().required());

const bodyUpdateJsonSchema = promoterSchema.only([
  "name",
  "description",
  "website",
  "email",
  "logo",
]);

const queryStringSchema = bodyUpdateJsonSchema.only([
  "name",
  "website",
  "email"]);

const readPromotersSchema = readFilteredItemsSchema("Read all promoters.", tags, queryStringSchema, promoterSchema)

const readPromoterByIdSchema = readItemByIdSchema("Read a single existing promoter, given id.", tags, queryStringSchema, promoterSchema)

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
