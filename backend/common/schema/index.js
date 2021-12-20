const createItemSchema = require("./createItemSchema");
const deleteItemSchema = require("./deleteItemSchema");
const updateItemByIdSchema = require("./updateItemByIdSchema");
const readItemByIdSchema = require("./readItemByIdSchema");
const readItemsSchema = require("./readItemsSchema");

module.exports = {
  readItemByIdSchema,
  readItemsSchema,
  createItemSchema,
  deleteItemSchema,
  updateItemByIdSchema,
};
