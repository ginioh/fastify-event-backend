"use strict";

const fp = require("fastify-plugin");
const i18next = require("i18next");
const middleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const path = require("path");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}.json"),
    },
    fallbackLng: "en",
    preload: ["en", "it"],
    detection: {
      lookupHeader: "accept-language",
    },
  });

const i18nextPlugin = async (fastify, opts) => {
  fastify.register(middleware.plugin, {
    i18next,
  })
}

module.exports = fp(i18nextPlugin, { name: 'i18next' })
