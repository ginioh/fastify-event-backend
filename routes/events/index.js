"use strict";

const EventService = require("./service");
const {
  eventSchema,
  readEventsSchema,
  readEventByIdSchema,
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
} = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");

module.exports = async function (fastify, opts) {
  // SERVICE
  const service = new EventService(fastify.mongo);

  fastify.get("/", { schema: readEventsSchema }, async (req, res) => {
    const projectionFields = getProjectionFields(req.query, eventSchema);
    const filters = new FilterUtils(req.query, eventSchema);
    if (filters.isFilterableQuery()) {
      return await service.readEventsByFilters(filters, projectionFields);
    }
    return await service.readEvents(projectionFields);
  });

  fastify.get("/:id", { schema: readEventByIdSchema }, async (req, res) => {
    const { id } = req.params;
    const projectionFields = getProjectionFields(req.query, eventSchema);
    return await service.readEventById(id, projectionFields);
  });

  fastify.post("/", { schema: createEventSchema }, async (req, res) => {
    //const { title, description, startDate, endDate } = req.body;
    // if (title || description || startDate || endDate) {
    return await service.createEvent(req.body);
    // } else throw fastify.httpErrors.badRequest();
  });

  fastify.put("/:id", { schema: updateEventSchema }, async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    console.log(req)
    if (id && (title || description || startDate || endDate)) {
      const result = await service.updateEvent(req.params.id, req.body);
      return {
        data: result.value,
        message: req.t('UPDATE_EVENT'),
      };
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deleteEventSchema }, async (req, res) => {
    const { id } = req.params;
    return await service.deleteEvent(id);
  });
};
