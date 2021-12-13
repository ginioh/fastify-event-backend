const {
  ResourceNotFoundError,
} = require("../../common/exceptions/db/ResourceNotFoundException");
const EventManagerDao = require("./dao");

class EventManagerService {
  constructor(mongoInstance) {
    this.dao = new EventManagerDao(mongoInstance);
  }

  readEventManagers = async (projectionFields) =>
    await this.dao.readEventManagers(projectionFields);

  readEventManagersByFilters = async (filters, projectionFields) =>
    await this.dao.readEventManagersByFilters(filters, projectionFields);

  readEventManagerById = async (id, projectionFields) => {
    const eventManager = await this.dao.readEventManagerById(id, projectionFields);
    if (eventManager && Object.keys(eventManager).length) {
      return eventManager;
    } else throw new ResourceNotFoundError();
  };

  createEventManager = async (eventManager) => {
    const createdEventManager = await this.dao.createEventManager(eventManager);
    if (createdEventManager.acknowledged && createdEventManager.insertedId) {
      return {
        insertedId: createdEventManager.insertedId,
      };
    } else throw ResourceNotFoundError();
  };

  updateEventManager = async (id, eventManager) => {
    const updatedEventManager = await this.dao.updateEventManager(id, eventManager);
    if (updatedEventManager.value && updatedEventManager.lastErrorObject.n) {
      return { data: updatedEventManager.value };
    } else throw new ResourceNotFoundError();
  };

  deleteEventManager = async (id) => {
    const deletedEventManager = await this.dao.deleteEventManager(id);
    if (deletedEventManager.acknowledged && deletedEventManager.deletedCount) {
      return true;
    } else throw new ResourceNotFoundError();
  };
}

module.exports = EventManagerService;
