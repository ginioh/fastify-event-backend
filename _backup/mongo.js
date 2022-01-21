"use strict";

const fp = require("fastify-plugin");
const fm = require("fastify-mongodb");
const isDocker = require("is-docker");

const mongoPlugin = async function (fastify, opts) {
  const configMongo = Object.assign(
    {},
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      forceClose: true,
      url: isDocker() ? process.env.MONGO_URL_DOCKER : process.env.MONGO_URL,
    },
    opts.mongodb
  );

  fastify.register(fm, configMongo);
}

module.exports = fp(mongoPlugin, { name: 'mongo' })