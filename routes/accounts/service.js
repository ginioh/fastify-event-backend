"use strict";

const {
  ResourceNotFoundException,
} = require("../../common/exceptions/db/ResourceNotFoundException");
const CategoryDao = require("./dao");

class CategoryService {
  constructor(mongoInstance) {
    this.dao = new CategoryDao(mongoInstance);
    if (!CategoryService._instance) {
      CategoryService._instance = this;
    }
    return CategoryService._instance;
  }

  readCategories = async (projectionFields) =>
    await this.dao.readCategories(projectionFields);

  readCategoriesByFilters = async (filters, projectionFields) =>
    await this.dao.readCategoriesByFilters(filters, projectionFields);

  readCategoryById = async (id, projectionFields) => {
    const category = await this.dao.readCategoryById(id, projectionFields);
    if (category && Object.keys(category).length) {
      return category;
    } else throw new ResourceNotFoundException();
  };

  createCategory = async (category) => {
    if (category.name) {
      category.slug = slugify(category.name)
    }
    const createdCategory = await this.dao.createCategory(category);
    if (createdCategory.acknowledged && createdCategory.insertedId) {
      return {
        insertedId: createdCategory.insertedId,
      };
    } else throw ResourceNotFoundException();
  };

  updateCategory = async (id, category) => {
    if (category.name) {
      category.slug = slugify(category.name)
    }
    const updatedCategory = await tshis.dao.updateCategory(id, category);
    if (updatedCategory.value && updatedCategory.lastErrorObject.n) {
      return { data: updatedCategory.value };
    } else throw new ResourceNotFoundException();
  };

  deleteCategory = async (id) => {
    const deletedCategory = await this.dao.deleteCategory(id);
    if (deletedCategory.acknowledged && deletedCategory.deletedCount) {
      return true;
    } else throw new ResourceNotFoundException();
  };
}

module.exports = CategoryService;
