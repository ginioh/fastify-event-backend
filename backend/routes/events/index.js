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
const { ResourceNotFoundException } = require("../../common/exceptions/db/ResourceNotFoundException");

module.exports = async function (fastify, opts) {

  // SERVICE //
  let service = null;
  if (fastify.mongoose.event) {
    service = new EventService(fastify.mongoose.event);
  } else throw new Error();

  // ROUTES //

  fastify.get("/", { schema: readEventsSchema }, async (req, res) => {
    const { query } = req;
    const projectionFields = getProjectionFields(query, eventSchema);
    const filters = new FilterUtils(query, eventSchema);
    if (filters.isFilterableQuery()) {
      return await service.readEventsByFilters(filters, projectionFields);
    }
    return await service.readEvents(projectionFields);
  });

  fastify.get("/:id", { schema: readEventByIdSchema }, async (req, res) => {
    const { query, params: { id } } = req;
    const projectionFields = getProjectionFields(query, eventSchema);
    return await service.readEventById(id, projectionFields);
  });

  fastify.post("/", { schema: createEventSchema }, async (req, res) => {
    const result = await service.createEvent(req.body);
    if (result) {
      return {
        item: result,
        message: req.t('CREATE_EVENT')
      }
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.put("/:id", { schema: updateEventSchema }, async (req, res) => {
    const { body, params: { id } } = req;
    if (id) {
      const result = await service.updateEvent(id, body);
      if (result) {
        return {
          item: result,
          message: req.t("UPDATE_EVENT"),
        };
      } else throw ResourceNotFoundException();
    } else throw fastify.httpErrors.badRequest();
  });

  fastify.delete("/:id", { schema: deleteEventSchema }, async (req, res) => {
    const { id } = req.params;
    const result = await service.deleteEvent(id);
    if (result.ok) {
      if (result.deletedCount) {
        return {
          message: req.t("DELETE_EVENT"),
        };
      } else throw new ResourceNotFoundException();
    } else throw fastify.httpErrors.badRequest();
  });
};
