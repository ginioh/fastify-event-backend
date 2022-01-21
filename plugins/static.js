"use strict";

const fp = require("fastify-plugin");
const path = require("path");

const staticPlugin = async (fastify, opts) => {
    fastify.register(require('fastify-static'), {
        root: path.join(path.resolve(), 'uploads'),
        prefix: '/uploads/'
    })
}

module.exports = fp(staticPlugin, { name: 'static' })
