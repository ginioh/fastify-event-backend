'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  fastify.addHook('onSend', (request, reply, payload, done) => {
    const newPayload = fastify.encrypt(payload);
    done(null, JSON.stringify(newPayload));
  })
}
