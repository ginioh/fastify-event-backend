const {
  ResourceNotFoundError,
} = require("../../common/exceptions/db/ResourceNotFoundException");
const PromoterDao = require("./dao");

class PromoterService {
  constructor(mongoInstance) {
    this.dao = new PromoterDao(mongoInstance);
  }

  readPromoters = async (projectionFields) =>
    await this.dao.readPromoters(projectionFields);

    readPromotersByFilters = async (filters, projectionFields) =>
    await this.dao.readPromotersByFilters(filters, projectionFields);

    readPromoterById = async (id, projectionFields) => {
    const eventManager = await this.dao.readPromoterById(id, projectionFields);
    if (eventManager && Object.keys(eventManager).length) {
      return eventManager;
    } else throw new ResourceNotFoundError();
  };

  createPromoter = async (eventManager) => {
    const createdEventManager = await this.dao.createPromoter(eventManager);
    if (createdEventManager.acknowledged && createdEventManager.insertedId) {
      return {
        insertedId: createdEventManager.insertedId,
      };
    } else throw ResourceNotFoundError();
  };

  updatePromoter = async (id, eventManager) => {
    const updatedEventManager = await this.dao.updatePromoter(id, eventManager);
    if (updatedEventManager.value && updatedEventManager.lastErrorObject.n) {
      return { data: updatedEventManager.value };
    } else throw new ResourceNotFoundError();
  };

  deletePromoter = async (id) => {
    const deletedEventManager = await this.dao.deletePromoter(id);
    if (deletedEventManager.acknowledged && deletedEventManager.deletedCount) {
      return true;
    } else throw new ResourceNotFoundError();
  };
}

module.exports = PromoterService;
