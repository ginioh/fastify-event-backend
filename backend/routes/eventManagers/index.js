"use strict";

const EventManagerService = require("./service");
const {
  eventManagerSchema, readEventManagersSchema, readEventManagerByIdSchema, createEventManagerSchema, updateEventManagerSchema, deleteEventManagerSchema,
} = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");

module.exports = async function (fastify, opts) {
  // SERVICE
  const service = new EventManagerService(fastify.mongo);

  fastify.get("/", { schema: readEventManagersSchema }, async (req, res) => {
    const projectionFields = getProjectionFields(req.query, eventManagerSchema);
    const filters = new FilterUtils(req.query, eventManagerSchema);
    if (filters.isFilterableQuery()) {
      return await service.readEventManagersByFilters(filters, projectionFields);
    }
    return await service.readEventManagers(projectionFields);
  });

  fastify.get("/:id", { schema: readEventManagerByIdSchema }, async (req, res) => {
    const { id } = req.params;
    const projectionFields = getProjectionFields(req.query, eventManagerSchema);
    return await service.readEventManagerById(id, projectionFields);
  });

  fastify.post("/", { schema: createEventManagerSchema }, async (req, res) => {
    const result = await service.createEventManager(req.body);
    return {
      ...result,
      message: req.t('CREATE_EVENT_MANAGER')
    }
  });

  fastify.put("/:id", { schema: updateEventManagerSchema }, async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    if (id && (title || description || startDate || endDate)) {
      const result = await service.updateEventManager(req.params.id, req.body);
      return {
        ...result,
        message: req.t("UPDATE_EVENT_MANAGER"),
      };
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deleteEventManagerSchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deleteEventManager(id);
    if (result) {
      return {
        message: req.t("DELETE_EVENT_MANAGER"),
      };
    }
  });
};
