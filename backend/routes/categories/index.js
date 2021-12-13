"use strict";

const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");
const CategoryService = require("./service");
const { readCategoriesSchema, categorySchema, readCategoryByIdSchema, createCategorySchema, updateCategorySchema, deleteCategorySchema } = require("./schema");

module.exports = async function (fastify, opts) {
  // SERVICE
  const service = new CategoryService(fastify.mongo);

  fastify.get("/", { schema: readCategoriesSchema }, async (req, res) => {
    const projectionFields = getProjectionFields(req.query, categorySchema);
    const filters = new FilterUtils(req.query, categorySchema);
    if (filters.isFilterableQuery()) {
      return await service.readCategoriesByFilters(filters, projectionFields);
    }
    return await service.readCategories(projectionFields);
  });

  fastify.get("/:id", { schema: readCategoryByIdSchema }, async (req, res) => {
    const { id } = req.params;
    const projectionFields = getProjectionFields(req.query, categorySchema);
    return await service.readEventById(id, projectionFields);
  });

  fastify.post("/", { schema: createCategorySchema }, async (req, res) => {
    const result = await service.createCategory(req.body);
    return {
      ...result,
      message: req.t("CREATE_CATEGORY"),
    };
  });

  fastify.put("/:id", { schema: updateCategorySchema }, async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    if (id && (title || description || startDate || endDate)) {
      const result = await service.updateCategory(req.params.id, req.body);
      return {
        ...result,
        message: req.t("UPDATE_CATEGORY"),
      };
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deleteCategorySchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deleteCategory(id);
    if (result) {
      return {
        message: req.t("DELETE_CATEGORY"),
      };
    }
  });
};
