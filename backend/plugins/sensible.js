'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(require('fastify-sensible'), {
    //errorHandler: true
  }).after(() => {
    fastify.setErrorHandler(function (error, request, reply) {
      reply.send(error)
    })
  })
})
