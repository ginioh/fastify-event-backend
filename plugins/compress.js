"use strict";

const fp = require("fastify-plugin");

const compressPlugin = async (fastify, opts) => {
    fastify.register(require('fastify-compress'))
}

module.exports = fp(compressPlugin, { name: 'compress' })
