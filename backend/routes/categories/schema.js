"use strict";

const S = require("fluent-json-schema");
const { createItemSchema, updateItemByIdSchema, deleteItemSchema } = require("../../common/schema");

const categorySchema = S.object()
.prop("name", S.string())
.prop("slug", S.string())
.prop("description", S.string())
.prop("icon", S.string());

const tags = ["eventManager"];

const bodyCreateJsonSchema = S.object()
  .prop("name", S.string().required())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("icon", S.string())

const bodyUpdateJsonSchema = categorySchema;

const readCategoriesSchema = {
  description: "Read all categories.",
  params: S.object()
    .prop("fields", S.string())
    .prop("sort", S.string())
    .prop("limit", S.number()),
  tags,
  response: {
    200: S.array().items(categorySchema),
  },
};

const readCategoryByIdSchema = {
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required())
      .prop("fields", S.string()),
  };

  const createCategorySchema = createItemSchema(tags, bodyCreateJsonSchema)

  const updateCategorySchema = updateItemByIdSchema(tags, bodyUpdateJsonSchema, categorySchema);

  const deleteCategorySchema = deleteItemSchema(tags);

module.exports = {
    categorySchema,
    readCategoriesSchema,
    readCategoryByIdSchema,
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema,
}
