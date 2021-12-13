'use strict'

const fp = require('fastify-plugin');
const fm = require('fastify-mongodb');
const isDocker = require('is-docker');

module.exports = fp(async function (fastify, opts) {
  const configMongo = Object.assign({}, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    forceClose: true,
    url: `mongodb://ginioh:ginioh_fastify_test@${isDocker() ? 'mongodb' : 'localhost'}:27017/fastify-test`,
  }, opts.mongodb)
  
  fastify.register(fm, configMongo);
});