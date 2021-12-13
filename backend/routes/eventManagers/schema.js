"use strict";

const S = require("fluent-json-schema");
const {
  createItemSchema,
  deleteItemSchema,
  updateItemByIdSchema,
} = require("../../common/schema");

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

const createEventManagerSchema = createItemSchema(tags, bodyCreateJsonSchema);

const updateEventManagerSchema = updateItemByIdSchema(
  tags,
  bodyUpdateJsonSchema,
  eventManagerSchema
);

const deleteEventManagerSchema = deleteItemSchema(tags);

module.exports = {
  eventManagerSchema,
  readEventManagersSchema,
  readEventManagerByIdSchema,
  createEventManagerSchema,
  updateEventManagerSchema,
  deleteEventManagerSchema,
};
