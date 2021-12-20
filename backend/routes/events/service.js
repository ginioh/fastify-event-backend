"use strict";

const {
  ResourceNotFoundException,
} = require("../../common/exceptions/db/ResourceNotFoundException");
const { slugify } = require("../../util/functions");
const EventDao = require("./dao");

class EventService {
  constructor(mongoInstance) {
    this.dao = new EventDao(mongoInstance);
  }

  readEvents = async (projectionFields) =>
    await this.dao.readEvents(projectionFields);

  readEventsByFilters = async (filters, projectionFields) =>
    await this.dao.readEventsByFilters(filters, projectionFields);

  readEventById = async (id, projectionFields) => await this.dao.readEventById(id, projectionFields);


  createEvent = async (event) => await this.dao.createEvent(event);


  updateEvent = async (id, event) => await this.dao.updateEvent(id, event);


  deleteEvent = async (id) => await this.dao.deleteEvent(id);
}

module.exports = EventService;
