"use strict";

const S = require("fluent-json-schema");
const { categorySchema } = require("../categories/schema")
const { promoterSchema } = require("../promoters/schema")

const {
  deleteItemSchema,
  updateItemByIdSchema,
  createItemSchema,
  readItemByIdSchema,
  readItemsSchema,
} = require("../../common/schema");
const eventSchema = S.object()
  .additionalProperties(false)
  .prop("_id", S.string())
  .prop("title", S.string())
  .prop("slug", S.string())
  .prop("description", S.string())
  .prop("featuredImage", S.string())
  .prop("assets", S.array().items(S.string()))
  .prop("tags", S.array().items(S.string()))
  .prop("category", categorySchema)
  .prop("promoter", promoterSchema)
  .prop("startDate", S.string().raw({ format: "date-time" }))
  .prop("endDate", S.string().raw({ format: "date-time" }))
  .prop("duration", S.number())
  .prop("url", S.string())
  .prop("locationName", S.string())
  .prop("locationLatitude", S.number())
  .prop("locationLongitude", S.number())
  .prop("isOffline", S.boolean())
  .prop("isPublic", S.boolean());

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
  .prop("tags", S.array().items(S.string()))
  .prop("category", S.string().required())
  .prop("promoter", S.string().required())
  .prop("startDate", S.string().raw({ format: "date-time" }).required())
  .prop("endDate", S.string().raw({ format: "date-time" }).required())
  .prop("url", S.string())
  .prop("locationName", S.string())
  .prop("locationLatitude", S.number())
  .prop("locationLongitude", S.number())
  .prop("isOffline", S.boolean())
  .prop("isPublic", S.boolean());

const bodyUpdateJsonSchema = eventSchema.only([
  "title",
  "description",
  "startDate",
  "endDate",
  "featuredImage",
  "assets",
  "tags",
  "category",
  "promoter",
  "url",
  "locationName",
  "locationLatitude",
  "locationLongitude",
  "isOffline",
  "isPublic"
]);

const readEventsSchema = readItemsSchema("Read all events.", tags, eventSchema);

const readEventByIdSchema = readItemByIdSchema("Read a single existing event, given id.", tags, eventSchema);

const createEventSchema = createItemSchema("Create a new event", tags, bodyCreateJsonSchema, eventSchema);

const updateEventSchema = updateItemByIdSchema("Update an existing event, given id.",
  tags,
  bodyUpdateJsonSchema,
  eventSchema
);

const deleteEventSchema = deleteItemSchema("Delete an existing event.", tags);

module.exports = {
  eventSchema,
  readEventsSchema,
  readEventByIdSchema,
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
};
