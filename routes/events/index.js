"use strict";

const {
  readEventsSchema,
  readMyEventsSchema,
  readEventByIdSchema,
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
  readFilteredEventsSchema
} = require("./schema");
const { readEvents, readPublicEvents, readMyEvents, readEventById, createEvent, updateEvent, deleteEvent } = require("./handler");

module.exports = async (fastify, opts) => {

  // ROUTES //

  fastify.get("/", { schema: readFilteredEventsSchema, onRequest: async (req, res) => await fastify.authorize(req, res, ['admin']) }, readEvents);

  fastify.get("/public", { schema: readFilteredEventsSchema }, readPublicEvents)

  fastify.get("/mine", {
    schema: readMyEventsSchema, onRequest: fastify.protect
  }, readMyEvents);

  fastify.get("/:id", { schema: readEventByIdSchema }, readEventById);

  fastify.post("/", { schema: createEventSchema, onRequest: fastify.protect }, createEvent);

  fastify.put("/:id", { schema: updateEventSchema, onRequest: fastify.protect }, updateEvent);

  fastify.delete("/:id", { schema: deleteEventSchema, onRequest: fastify.protect }, deleteEvent);

  // fastify.addHook('onSend', (request, reply, payload, done) => {
  //   const newPayload = fastify.encrypt(payload);
  //   done(null, JSON.stringify(newPayload));
  // })
};
