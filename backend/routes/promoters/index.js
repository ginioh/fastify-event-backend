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
const { AuthorizationException } = require("../../common/exceptions/auth/AuthorizationException");
const { ResourceNotFoundException } = require("../../common/exceptions/db/ResourceNotFoundException");

module.exports = async function (fastify, opts) {

  // SERVICE //
  let service = null;
  if (fastify.mongoose.promoter) {
    service = new PromoterService(fastify.mongoose.promoter);
  } else throw new Error();

  // ROUTES //

  fastify.get("/", { schema: readPromotersSchema }, async (req, res) => {
    const { query } = req;
    const projectionFields = getProjectionFields(query, promoterSchema);
    const filters = new FilterUtils(query, promoterSchema);
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
    if (result) {
      return {
        item: result,
        message: req.t('CREATE_PROMOTER')
      }
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.put("/:id", { schema: updatePromoterSchema }, async (req, res) => {
    const { body, params: { id } } = req;
    if (id) {
      const result = await service.updatePromoter(id, body);
      if (result) {
        return {
          item: result,
          message: req.t("UPDATE_PROMOTER"),
        };
      } else throw ResourceNotFoundException();
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deletePromoterSchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deletePromoter(id);
    if (result.ok) {
      if (result.deletedCount) {
        return {
          message: req.t("DELETE_PROMOTER"),
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
}

