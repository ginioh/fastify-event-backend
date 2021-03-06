"use strict";

class CategoryDao {
  constructor(mongoInstance) {
    if (!CategoryDao._instance) {
      this.mongo = mongoInstance;
      CategoryDao._instance = this;
    }
    return CategoryDao._instance;
  }

  readCategories = async (projectionFields) => {
    try {
      return await this.mongo.find({}).select(projectionFields);
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  readCategoriesByFilters = async (filters, projectionFields) => {
    try {
      return await this.mongo
        .find({ ...filters.getWhere() })
        .select({ ...projectionFields })
        .sort({ ...filters.getSort() })
        .limit(filters.getLimit())
    } catch (err) {
      throw new Error();
    }
  };

  readCategoryById = async (id, projectionFields) => {
    try {
      return await this.mongo.findById(id).select({ ...projectionFields })
    } catch (err) {
      throw new Error();
    }
  };

  createCategory = async (category) => {
    try {
      return await this.mongo.create(category);
    } catch (err) {
      throw new Error();
    }
  };

  updateCategory = async (id, category) => {
    try {
      return await this.mongo.findByIdAndUpdate(
        id,
        category,
        { new: true }
      );
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  deleteCategory = async (id) => {
    try {
      return await this.mongo.deleteOne({ _id: id });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = CategoryDao;
