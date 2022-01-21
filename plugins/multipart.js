"use strict";

const fp = require("fastify-plugin");

const multipartPlugin = async (fastify, opts) => {
    fastify.register(require('fastify-multipart', {
        // attachFieldsToBody: true
    }), {
        // limits: {
        //     fieldNameSize: 1000, // Max field name size in bytes
        //     fieldSize: 100,     // Max field value size in bytes
        //     fields: 10,         // Max number of non-file fields
        //     fileSize: 1000000,  // For multipart forms, the max file size in bytes
        //     files: 10,           // Max number of file fields
        //     headerPairs: 20000   // Max number of header key=>value pairs
        // }
    })
}

module.exports = fp(multipartPlugin, { name: 'multipart', dependencies: ['cors'] })
