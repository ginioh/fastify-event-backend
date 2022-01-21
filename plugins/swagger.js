'use strict'

const fp = require('fastify-plugin');

module.exports = fp(async function (fastify, opts) {
    fastify.register(require('fastify-swagger'), {
        mode: 'dynamic',
        routePrefix: '/documentation',

        swagger: {
            info: {
                title: "Event manager API",
                description: "Api documentation for Event Manager app.",
                version: "0.1.0"
            },
            host: 'localhost:3000',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                { name: 'Event', description: 'Events related end-points' },
                { name: 'Category', description: 'Categories related end-points' },
                { name: 'Promoter', description: 'Promoters related end-points' },
            ],
            definitions: {
                Event: {
                    type: 'object',
                    required: ['_id', 'title', 'icon'],
                    properties: {
                        _id: { type: 'string', format: 'ObjectID' },
                        title: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        featuredImage: { type: 'string', format: 'uri' },
                        assets: { type: 'array', items: { type: 'string', format: 'uri' } },
                        tags: { type: 'array', items: { type: 'string' } },
                        category: { $ref: '#/definitions/Category' },
                        promoter: { $ref: '#/definitions/Promoter' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                        duration: { type: 'number' },
                        maxAttendance: { type: 'integer' },
                        url: { type: 'string', format: 'uri' },
                        locationName: { type: 'string' },
                        locationLatitude: { type: 'number', format: 'float' },
                        locationLongitude: { type: 'number', format: 'float' },
                        isOffline: { type: 'boolean' },
                        isPublic: { type: 'boolean' },
                        createdBy: { type: 'string', format: 'ObjectID' },
                        updatedBy: { type: 'string', format: 'ObjectID' },
                        invited: {
                            type: 'array', items: {
                                type: 'object', properties: {
                                    email: { type: 'string', format: 'email' },
                                    sent: { type: 'boolean' }
                                }
                            }
                        },
                    }
                },
                Category: {
                    type: 'object',
                    required: ['_id', 'name', 'icon'],
                    properties: {
                        _id: { type: 'string', format: 'objectID' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        icon: { type: 'string' }
                    }
                },
                Promoter: {
                    type: 'object',
                    required: ['_id', 'name', 'website', 'email', 'logo'],
                    properties: {
                        _id: { type: 'string', format: 'objectID' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        website: { type: 'string', format: 'uri' },
                        email: { type: 'string', format: 'email' },
                        logo: { type: 'string', format: 'uri' }
                    }
                }
            },
            securityDefinitions: {
                apiKey: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header'
                }
            }
        },
        exposeRoute: true
    });
});