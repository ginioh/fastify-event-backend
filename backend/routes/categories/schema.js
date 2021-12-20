"use strict";

const S = require("fluent-json-schema");
const { readItemByIdSchema,
  readItemsSchema, createItemSchema, updateItemByIdSchema, deleteItemSchema } = require("../../common/schema");

const categorySchema = S.object()
  .additionalProperties(false)
  .prop("_id", S.string())
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

const bodyUpdateJsonSchema = categorySchema.only([
  "name", "slug", "description", "icon"
]);

const readCategoriesSchema = readItemsSchema("Read all categories.", tags, categorySchema)

const readCategoryByIdSchema = readItemByIdSchema("Read a single existing category, given id.", tags, categorySchema)

const createCategorySchema = createItemSchema("Create a new category.", tags, bodyCreateJsonSchema)

const updateCategorySchema = updateItemByIdSchema("Update an existing category, given id.", tags, bodyUpdateJsonSchema, categorySchema);

const deleteCategorySchema = deleteItemSchema("Delete an existing category.", tags);

module.exports = {
  categorySchema,
  readCategoriesSchema,
  readCategoryByIdSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
}
