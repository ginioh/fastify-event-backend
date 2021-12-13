"use strict";

const S = require("fluent-json-schema");

const eventManagerSchema = S.object()
  .prop("name", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string())
  .prop("email", S.string())
  .prop("logo", S.string());

const tags = ["eventManager"];

const bodyCreateJsonSchema = S.object()
  .prop("name", S.string().required())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("website", S.string())
  .prop("email", S.string().required())
  .prop("logo", S.string());

const bodyUpdateJsonSchema = eventManagerSchema.only([
  "name",
  "slug",
  "description",
  "website",
  "email",
  "logo",
]);

const readEventManagersSchema = {
  description: "Read all event managers.",
  params: S.object()
    .prop("fields", S.string())
    .prop("sort", S.string())
    .prop("limit", S.number()),
  tags,
  response: {
    200: S.array().items(eventManagerSchema),
  },
};

const readEventManagerByIdSchema = {
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required())
      .prop("fields", S.string()),
  };

  const createEventManagerSchema = {
    tags,
    body: bodyCreateJsonSchema,
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("insertedId", S.string())
        .prop("message", S.string()),
    },
  };

  const updateEventManagerSchema = {
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    body: bodyUpdateJsonSchema,
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("data", eventSchema)
        .prop("message", S.string().required()),
    },
  };
  
  const deleteEventManagerSchema = {
    tags,
    params: S.object()
      .additionalProperties(false)
      .prop("id", S.string().required()),
    response: {
      200: S.object()
        .additionalProperties(false)
        .prop("message", S.string().required()),
    },
  };

module.exports = {
  eventManagerSchema,
  readEventManagersSchema,
  readEventManagerByIdSchema,
  createEventManagerSchema,
  updateEventManagerSchema,
  deleteEventManagerSchema,
};
