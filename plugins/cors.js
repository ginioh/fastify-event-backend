"use strict";

const fp = require("fastify-plugin")

const corsPlugin = async (fastify, opts) => {
    fastify.register(require("fastify-cors"), {
        origin: "http://localhost:3001",
        // allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type", "Accept-Language", "Origin", "Authorization"],
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        // hideOptionsRoute: true
    });
}

module.exports = fp(corsPlugin, { name: 'cors' })