"use strict";

const S = require("fluent-json-schema");

const eventSchema = S.object()
  .additionalProperties(false)
  .prop("_id", S.string())
  .prop("title", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("featuredImage", S.string())
  .prop("assets", S.array().items(S.string()))
  .prop("tags", S.array().items(S.string()))
  .prop("category", S.string())
  .prop("startDate", S.string().raw({ format: "date-time" }))
  .prop("endDate", S.string().raw({ format: "date-time" }))
  .prop("duration", S.number())
  .prop("url", S.string())
  .prop(
    "location",
    S.object()
      .additionalProperties(false)
      .prop("name", S.string())
      .prop("lat", S.number())
      .prop("lng", S.number())
  )
  .prop("offline", S.boolean().default(true))
  .prop("public", S.boolean().default(true));

const tags = ["event"];

const paramsJsonSchema = S.object()
  .additionalProperties(false)
  .prop("fields", S.string().raw({ nullable: true }));

const bodyCreateJsonSchema = S.object()
  .additionalProperties(false)
  .prop("title", S.string().required())
  .prop("description", S.string().required())
  .prop("featuredImage", S.string().required())
  .prop("assets", S.array().items(S.string()))
  .prop("category", S.string().required())
  .prop("startDate", S.string().raw({ format: "date-time" }).required())
  .prop("endDate", S.string().raw({ format: "date-time" }).required());

const bodyUpdateJsonSchema = eventSchema.only([
  "title",
  "description",
  "startDate",
  "endDate",
]);

const readEventsSchema = {
  description: "Read all events",
  params: S.object()
    .prop("fields", S.string())
    .prop("sort", S.string())
    .prop("limit", S.number()),
  tags,
  response: {
    200: S.array().items(eventSchema),
  },
};

const readEventByIdSchema = {
  tags,
  params: S.object()
    .additionalProperties(false)
    .prop("id", S.string().required())
    .prop("fields", S.string()),
};

const createEventSchema = {
  tags,
  body: bodyCreateJsonSchema,
  response: {
    200: S.object()
      .additionalProperties(false)
      .prop("insertedId", S.string())
      .prop("message", S.string()),
  },
};

const updateEventSchema = {
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

const deleteEventSchema = {
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
  eventSchema,
  readEventsSchema,
  readEventByIdSchema,
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
};
