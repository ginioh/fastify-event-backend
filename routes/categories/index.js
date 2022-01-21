"use strict";

const { readCategoriesSchema, readCategoryByIdSchema, createCategorySchema, updateCategorySchema, deleteCategorySchema } = require("./schema");
const { readCategories, readCategoryById, createCategory, updateCategory, deleteCategory} = require("./handler");

module.exports = async (fastify, opts) => {

  // SERVICE //

  // const service = controller(fastify.models.categoryModel);

  // ROUTES //

  fastify.get("/", { schema: readCategoriesSchema }, readCategories);

  fastify.get("/:id", { schema: readCategoryByIdSchema }, readCategoryById);

  fastify.post("/", { schema: createCategorySchema }, createCategory);

  fastify.put("/:id", { schema: updateCategorySchema }, updateCategory);

  fastify.delete("/:id", { schema: deleteCategorySchema }, deleteCategory);

  // HOOKS //

  fastify.addHook('onRequest', await fastify.protect)

};
