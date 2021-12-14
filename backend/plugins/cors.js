const fp = require("fastify-plugin")

module.exports = fp(async (fastify, opts) => {
    fastify.register(require("fastify-cors"), {
        origin: "*",
        allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type", "Accept-Language", "Origin"],
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        hideOptionsRoute: true
    });
});