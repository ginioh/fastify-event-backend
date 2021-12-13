"use strict";

const EventManagerService = require("./service");
const {
  eventManagerSchema,
  // readEventsSchema,
  // readEventByIdSchema,
  // createEventSchema,
  // updateEventSchema,
  // deleteEventSchema,
} = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");

module.exports = async function (fastify, opts) {
  // SERVICE
  const service = new EventManagerService(fastify.mongo);

  fastify.get("/", { schema: readEventsSchema }, async (req, res) => {
    const projectionFields = getProjectionFields(req.query, eventManagerSchema);
    const filters = new FilterUtils(req.query, eventManagerSchema);
    if (filters.isFilterableQuery()) {
      return await service.readEventsByFilters(filters, projectionFields);
    }
    return await service.readEvents(projectionFields);
  });

  fastify.get("/:id", { schema: readEventByIdSchema }, async (req, res) => {
    const { id } = req.params;
    const projectionFields = getProjectionFields(req.query, eventManagerSchema);
    return await service.readEventById(id, projectionFields);
  });

  fastify.post("/", { schema: createEventSchema }, async (req, res) => {
    const result = await service.createEvent(req.body);
    return {
      ...result,
      message: req.t('CREATE_EVENT')
    }
  });

  fastify.put("/:id", { schema: updateEventSchema }, async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    console.log(req);
    if (id && (title || description || startDate || endDate)) {
      const result = await service.updateEvent(req.params.id, req.body);
      return {
        ...result,
        message: req.t("UPDATE_EVENT"),
      };
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deleteEventSchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deleteEvent(id);
    if (result) {
      return {
        message: req.t("DELETE_EVENT"),
      };
    }
  });
};
