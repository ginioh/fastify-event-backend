'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const App = require('../app')
const { beforeEach, teardown, test } = require('tap')
const clean = require('mongo-clean')
const { MongoClient } = require('mongodb')
require('dotenv').config()

let client;

beforeEach(async function () {
  if (!client) {
    client = await MongoClient.connect(process.env.MONGO_URL_TEST, {
      w: 1,
      useNewUrlParser: true
    });
  }

  await clean(client.db(process.env.MONGO_TEST_DB));
});

teardown(async function () {
  if (client) {
    await client.close()
    client = null
  }
})

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    mongodb: {
      client,
      database: process.env.MONGO_TEST_DB
    }
  }
}

// automatically build and tear down our instance
function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}

module.exports = {
  config,
  build
}
