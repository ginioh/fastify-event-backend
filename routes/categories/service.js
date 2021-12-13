const {
  ResourceNotFoundError,
} = require("../../exceptions/db/ResourceNotFoundException");
const CategoryDao = require("./dao");

class EventService {
  constructor(mongoInstance) {
    this.dao = new CategoryDao(mongoInstance);
    if (!EventService._instance) {
      EventService._instance = this;
    }
    return EventService._instance;
  }
  
  readCategories = async (projectionFields) =>
    await this.dao.readCategories(projectionFields);

  readCategoriesByFilters = async (filters, projectionFields) =>
    await this.dao.readCategoriesByFilters(filters, projectionFields);

  readCategoryById = async (id, projectionFields) => {
    const category = await this.dao.readCategoryById(id, projectionFields);
    if (category && Object.keys(category).length) {
      return category;
    } else throw new ResourceNotFoundError();
  };

  createEvent = async (category) => {
    const createdCategory = await this.dao.createEvent(category);
    if (createdCategory.acknowledged && createdCategory.insertedId) {
      return {
        insertedId: createdCategory.insertedId,
      };
    } else throw ResourceNotFoundError();
  };

  updateCategory = async (id, category) => {
    const updatedCategory = await tshis.dao.updateCategory(id, category);
    if (updatedCategory.value && updatedCategory.lastErrorObject.n) {
      return { data: updatedCategory.value };
    } else throw new ResourceNotFoundError();
  };

  deleteCategory = async (id) => {
    const deletedCategory = await this.dao.deleteCategory(id);
    if (deletedCategory.acknowledged && deletedCategory.deletedCount) {
      return true;
    } else throw new ResourceNotFoundError();
  };
}

module.exports = EventService;
