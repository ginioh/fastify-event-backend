"use strict";

const S = require("fluent-json-schema");
// const { createItemSchema, updateItemByIdSchema, deleteItemSchema } = require("../../common/schema");

// const categorySchema = S.object()
// .prop("_id", S.string())
// .prop("name", S.string())
// .prop("slug", S.string())
// .prop("description", S.string())
// .prop("icon", S.string());

const tags = ["account"];

// const bodyCreateJsonSchema = S.object()
//   .prop("name", S.string().required())
//   .prop("slug", S.string())
//   .prop("description", S.string())
//   .prop("icon", S.string())

// const bodyUpdateJsonSchema = categorySchema.only([
//   "name", "slug", "description", "icon"
// ]);

// const readCategoriesSchema = {
//   description: "Read all categories.",
//   params: S.object()
//     .prop("fields", S.string())
//     .prop("sort", S.string())
//     .prop("limit", S.number()),
//   tags,
//   response: {
//     200: S.array().items(categorySchema),
//   },
// };

const loginSchema = {
  tags,
  body: S.object().additionalProperties(false).prop("username", S.string().required()).prop("password", S.string().required()),
  response: {
    200: S.string()
  },
};

// const readCategoryByIdSchema = {
//     tags,
//     params: S.object()
//       .additionalProperties(false)
//       .prop("id", S.string().required())
//       .prop("fields", S.string()),
//   };

//   const createCategorySchema = createItemSchema(tags, bodyCreateJsonSchema)

//   const updateCategorySchema = updateItemByIdSchema(tags, bodyUpdateJsonSchema, categorySchema);

//   const deleteCategorySchema = deleteItemSchema(tags);

module.exports = {
    loginSchema
}
