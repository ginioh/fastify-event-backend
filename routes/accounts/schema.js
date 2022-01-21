"use strict";

const S = require("fluent-json-schema");

const tags = ["account"];

const readAccountByIdSchema = {
  tags,
  body: S.object().additionalProperties(false).prop("username", S.string().required()).prop("password", S.string().required()),
  response: {
    200: S.string()
  },
};

module.exports = {
  readAccountByIdSchema
}
