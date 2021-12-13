'use strict'

const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
    fastify.register(require('fastify-swagger'), {
        mode: 'dynamic',
        routePrefix: '/documentation',

        swagger: {
            info: 'info',
            description: 'description',
            version: '1.0',
            host: 'localhost',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                { name: 'event', description: 'Event related end-points' },
            ],
        },
        exposeRoute: true
    });
});