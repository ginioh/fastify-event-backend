"use strict";

const {
  readPromotersSchema,
  readPromoterByIdSchema,
  createPromoterSchema,
  updatePromoterSchema,
  deletePromoterSchema,
} = require("./schema");
const { readPromoterById, readPromoters, createPromoter, updatePromoter, deletePromoter } = require("./handler");

module.exports = async (fastify, opts) => {

  // ROUTES //

  fastify.get("/", { schema: readPromotersSchema }, readPromoters);

  fastify.get("/:id", { schema: readPromoterByIdSchema }, readPromoterById);

  fastify.post("/", { schema: createPromoterSchema }, createPromoter);

  fastify.put("/:id", { schema: updatePromoterSchema }, updatePromoter);

  fastify.delete("/:id", { schema: deletePromoterSchema }, deletePromoter);

  // HOOKS //

  fastify.addHook('onRequest', fastify.protect)
}

