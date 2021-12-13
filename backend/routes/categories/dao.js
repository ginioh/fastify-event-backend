class CategoryDao {
  constructor(mongoInstance) {
    if (!CategoryDao._instance) {
      this.mongo = mongoInstance;
      this.collection = this.mongo.db.collection("category");
      CategoryDao._instance = this;
    }
    return CategoryDao._instance;
  }

  readCategories = async (projectionFields) => {
    try {
      return await this.collection
        .find({}, { projection: projectionFields })
        .toArray();
    } catch (err) {
      throw new Error();
    }
  };

  readCategoriesByFilters = async (filters, projectionFields) => {
    try {
      return await this.collection
        .find({ ...filters.getWhere() }, { projection: projectionFields })
        .sort({ ...filters.getSort() })
        .limit(filters.getLimit())
        .toArray();
    } catch (err) {
      throw new Error();
    }
  };

  readCategoryById = async (id, projectionFields) => {
    try {
      return await this.collection.findOne(
        { _id: this.mongo.ObjectId(id) },
        { projection: projectionFields }
      );
    } catch (err) {
      throw new Error();
    }
  };

  createCategory = async (category) => {
    try {
      return await this.collection.insertOne(category);
    } catch (err) {
      throw new Error();
    }
  };

  updateCategory = async (id, category) => {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: this.mongo.ObjectId(id) },
        { $set: { ...category } },
        { returnDocument: "after" }
      );
    } catch (err) {
      throw new Error();
    }
  };

  deleteCategory = async (id) => {
    try {
      return await this.collection.deleteOne({ _id: this.mongo.ObjectId(id) });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = CategoryDao;
