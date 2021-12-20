"use strict";

const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");
const CategoryService = require("./service");
const { AuthorizationException } = require("../../common/exceptions/auth/AuthorizationException")
const { readCategoriesSchema, categorySchema, readCategoryByIdSchema, createCategorySchema, updateCategorySchema, deleteCategorySchema } = require("./schema");

module.exports = async function (fastify, opts) {

  // SERVICE //
  let service = null;
  if (fastify.mongoose.category) {
    service = new CategoryService(fastify.mongoose.category);
  } else throw new Error();

  // ROUTES //

  fastify.get("/", { schema: readCategoriesSchema }, async (req, res) => {
    const projectionFields = getProjectionFields(req.query, categorySchema);
    const filters = new FilterUtils(req.query, categorySchema);
    if (filters.isFilterableQuery()) {
      return await service.readCategoriesByFilters(filters, projectionFields);
    }
    return await service.readCategories(projectionFields);
  });

  fastify.get("/:id", { schema: readCategoryByIdSchema }, async (req, res) => {
    const { query, params: { id } } = req;
    const projectionFields = getProjectionFields(query, categorySchema);
    return await service.readCategoryById(id, projectionFields);
  });

  fastify.post("/", { schema: createCategorySchema }, async (req, res) => {
    const result = await service.createCategory(req.body);
    if (result) {
      return {
        item: result,
        message: req.t("CREATE_CATEGORY"),
      }
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.put("/:id", { schema: updateCategorySchema }, async (req, res) => {
    const { body, params: { id } } = req;
    if (id) {
      const result = await service.updateCategory(id, body);
      if (result) {
        return {
          item: result,
          message: req.t("UPDATE_CATEGORY"),
        };
      } else throw ResourceNotFoundException();
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deleteCategorySchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deleteCategory(id);
    if (result.ok) {
      if (result.deletedCount) {
        return {
          message: req.t("DELETE_CATEGORY"),
        };
      } else throw new ResourceNotFoundException();
    } else throw fastify.httpErrors.badRequest();
  });

  // HOOKS //

  fastify.addHook('onRequest', async function hook(req, res) {
    try {
      await fastify.protect(req, res);
    } catch (err) {
      throw new AuthorizationException()
    }
  })
};
