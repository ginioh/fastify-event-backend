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
  readFilteredItemsSchema
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
  .prop("maxAttendance", S.number())
  .prop("url", S.string())
  .prop("locationName", S.string())
  .prop("locationLatitude", S.number())
  .prop("locationLongitude", S.number())
  .prop("isOffline", S.boolean())
  .prop("isPublic", S.boolean())
  .prop("createdBy", S.string())
  .prop("updatedBy", S.string())
  .prop("invited", S.array().items(S.object().prop("email", S.string())));

const tags = ["Event"];

const bodyCreateJsonSchema = S.object()
  .additionalProperties(false)
  .prop("document",)
  .prop("title", S.string().required())
  .prop("description", S.string().required())
  .prop("featuredImage", S.string().required())
  .prop("assets", S.array().items(S.string()))
  .prop("tags", S.array().items(S.string()))
  .prop("category", S.string().required())
  .prop("promoter", S.string().required())
  .prop("startDate", S.string().raw({ format: "date-time" }).required())
  .prop("endDate", S.string().raw({ format: "date-time" }).required())
  .prop("maxAttendance", S.number())
  .prop("url", S.string())
  .prop("locationName", S.string().required())
  .prop("locationLatitude", S.number())
  .prop("locationLongitude", S.number())
  .prop("isOffline", S.boolean().required())
  .prop("isPublic", S.boolean().required())
  .prop("invited", S.array().items(S.object().prop("email", S.string())));

const bodyUpdateJsonSchema = eventSchema.only([
  "title",
  "description",
  "startDate",
  "endDate",
  "maxAttendance",
  "featuredImage",
  "assets",
  "tags",
  "url",
  "locationName",
  "locationLatitude",
  "locationLongitude",
  "isOffline",
  "isPublic"
]).prop('promoter', S.string()).prop('category', S.string());

const queryStringSchema = bodyUpdateJsonSchema.only([
  "title",
  "startDate",
  "endDate",
  "maxAttendance",
  "locationName",
  "isOffline",
  "isPublic"]);


const readFilteredEventsSchema = readFilteredItemsSchema("Read all events.", tags, queryStringSchema, eventSchema);

const readMyEventsSchema = readFilteredItemsSchema("Read all events created by user.", tags, queryStringSchema, eventSchema);

const readEventsSchema = readItemsSchema("Read all events.", tags, queryStringSchema, eventSchema);

const readEventByIdSchema = readItemByIdSchema("Read a single existing event, given id.", tags, queryStringSchema, eventSchema);

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
  readMyEventsSchema,
  readEventByIdSchema,
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
  readFilteredEventsSchema
};
