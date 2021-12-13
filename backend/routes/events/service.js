const {
  ResourceNotFoundError,
} = require("../../common/exceptions/db/ResourceNotFoundException");
const EventDao = require("./dao");

class EventService {
  constructor(mongoInstance) {
    this.dao = new EventDao(mongoInstance);
  }

  readEvents = async (projectionFields) =>
    await this.dao.readEvents(projectionFields);

  readEventsByFilters = async (filters, projectionFields) =>
    await this.dao.readEventsByFilters(filters, projectionFields);

  readEventById = async (id, projectionFields) => {
    const event = await this.dao.readEventById(id, projectionFields);
    if (event && Object.keys(event).length) {
      return event;
    } else throw new ResourceNotFoundError();
  };

  createEvent = async (event) => {
    if (event.startDate) event.startDate = new Date(event.startDate);
    if (event.endDate) event.endDate = new Date(event.endDate);

    const createdEvent = await this.dao.createEvent(event);
    if (createdEvent.acknowledged && createdEvent.insertedId) {
      return {
        insertedId: createdEvent.insertedId,
      };
    } else throw ResourceNotFoundError();
  };

  updateEvent = async (id, event) => {
    if (event.startDate) event.startDate = new Date(event.startDate);
    if (event.endDate) event.endDate = new Date(event.endDate);

    const updatedEvent = await this.dao.updateEvent(id, event);
    if (updatedEvent.value && updatedEvent.lastErrorObject.n) {
      return { data: updatedEventvalue };
    } else throw new ResourceNotFoundError();
  };

  deleteEvent = async (id) => {
    const deletedEvent = await this.dao.deleteEvent(id);
    if (deletedEvent.acknowledged && deletedEvent.deletedCount) {
      return true;
    } else throw new ResourceNotFoundError();
  };
}

module.exports = EventService;
