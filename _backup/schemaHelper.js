"use strict";

const fp = require("fastify-plugin");
const S = require("fluent-json-schema");

const schemaHelperPlugin = async function (fastify, opts) {
    const createItemSchema = function (tags, bodySchema, itemSchema) {
        return {
            tags,
            body: bodySchema,
            response: {
                200: S.object()
                    .prop('item', itemSchema)
                    .prop('message', S.string()),
                400: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
                401: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
            },
        };
    }

    const deleteItemSchema = function (tags) {
        return {
            tags,
            params: S.object()
                .additionalProperties(false)
                .prop("id", S.string().required()),
            response: {
                200: S.object()
                    .additionalProperties(false)
                    .prop("message", S.string().required()),
                400: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
                401: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
            },
        };
    }

    const readItemByIdSchema = (tags, itemSchema) => {
        return {
            tags,
            params: S.object()
                .additionalProperties(false)
                .prop("id", S.string().required())
                .prop("fields", S.string()),
            response: {
                200: itemSchema,
                400: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
                401: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
            }
        };
    }

    const readItemsSchema = (tags, itemSchema) => {
        return {
            // description: "Read all events",
            params: S.object()
                .prop("fields", S.string())
                .prop("sort", S.string())
                .prop("limit", S.number()),
            tags,
            response: {
                200: S.array().items(itemSchema),
                400: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
                401: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
            },
        };
    }

    const updateItemByIdSchema = function (tags, bodySchema, itemSchema) {
        return {
            tags,
            params: S.object()
                .additionalProperties(false)
                .prop("id", S.string().required()),
            body: bodySchema,
            response: {
                200: S.object()
                    .additionalProperties(false)
                    .prop("item", itemSchema)
                    .prop("message", S.string().required()),
                400: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
                401: S.object()
                    .prop('statusCode', S.number())
                    .prop('code', S.string())
                    .prop('error', S.string())
                    .prop('message', S.string()),
            },
        };
    };

    const schemaHelper = {
        createItemSchema,
        updateItemByIdSchema,
        deleteItemSchema,
        readItemByIdSchema,
        readItemsSchema
    }

    fastify.decorate("schemaHelper", schemaHelper)
}

module.exports = fp(schemaHelperPlugin)