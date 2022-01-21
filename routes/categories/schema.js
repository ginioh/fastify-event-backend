"use strict";

const S = require("fluent-json-schema");
const { readItemByIdSchema, createItemSchema, updateItemByIdSchema, deleteItemSchema, readFilteredItemsSchema } = require("../../common/schema");

const categorySchema = S.object()
  .additionalProperties(false)
  .prop("_id", S.string())
  .prop("name", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("icon", S.string());


const tags = ["Category"];

const bodyCreateJsonSchema = S.object()
  .additionalProperties(false)
  .prop("name", S.string().required())
  .prop("description", S.string())
  .prop("icon", S.string().required());

const bodyUpdateJsonSchema = categorySchema.only([
  "name", "description", "icon"
]);

const queryStringSchema = bodyUpdateJsonSchema.only(["name", "description"]);

const readCategoriesSchema = readFilteredItemsSchema("Read all categories.", tags, queryStringSchema, categorySchema)

const readCategoryByIdSchema = readItemByIdSchema("Read a single existing category, given id.", tags, queryStringSchema, categorySchema)

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
