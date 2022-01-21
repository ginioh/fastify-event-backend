"use strict";

const fp = require("fastify-plugin");

const rateLimitPlugin = async (fastify, opts) => {
    await fastify.register(require('fastify-rate-limit'), {
        max: 100,
        timeWindow: '1 minute',
        redis: fastify.redis
    })
    if (process.env.NODE_ENV === "production") fastify.setNotFoundHandler({
        preHandler: fastify.rateLimit({
            max: 4,
            timeWindow: 500
        })
    }, function (request, reply) {
        reply.code(404).send({ error: 404 })
    })
}

module.exports = fp(rateLimitPlugin, { name: 'rateLimit', dependencies: ['redis'] })
