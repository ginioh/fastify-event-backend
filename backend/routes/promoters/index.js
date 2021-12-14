"use strict";

const PromoterService = require("./service");
const {
  promoterSchema,
  readPromotersSchema,
  readPromoterByIdSchema,
  createPromoterSchema,
  updatePromoterSchema,
  deletePromoterSchema,
} = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");

module.exports = async function (fastify, opts) {
  // SERVICE
  const service = new PromoterService(fastify.mongo);

  fastify.get("/", { schema: readPromotersSchema }, async (req, res) => {
    const projectionFields = getProjectionFields(req.query, promoterSchema);
    const filters = new FilterUtils(req.query, promoterSchema);
    if (filters.isFilterableQuery()) {
      return await service.readPromotersByFilters(filters, projectionFields);
    }
    return await service.readPromoters(projectionFields);
  });

  fastify.get("/:id", { schema: readPromoterByIdSchema }, async (req, res) => {
    const { id } = req.params;
    const projectionFields = getProjectionFields(req.query, promoterSchema);
    return await service.readPromoterById(id, projectionFields);
  });

  fastify.post("/", { schema: createPromoterSchema }, async (req, res) => {
    const result = await service.createPromoter(req.body);
    return {
      ...result,
      message: req.t('CREATE_PROMOTER')
    }
  });

  fastify.put("/:id", { schema: updatePromoterSchema }, async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    if (id && (title || description || startDate || endDate)) {
      const result = await service.updatePromoter(req.params.id, req.body);
      return {
        ...result,
        message: req.t("UPDATE_PROMOTER"),
      };
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deletePromoterSchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deletePromoter(id);
    if (result) {
      return {
        message: req.t("DELETE_PROMOTER"),
      };
    }
  });
};
