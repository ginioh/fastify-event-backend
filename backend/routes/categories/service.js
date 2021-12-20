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

  readCategoryById = async (id, projectionFields) => await this.dao.readCategoryById(id, projectionFields);


  createCategory = async (category) => await this.dao.createCategory(category);

  updateCategory = async (id, category) => await this.dao.updateCategory(id, category);

  deleteCategory = async (id) => await this.dao.deleteCategory(id);
}

module.exports = CategoryService;
