class PromoterDao {
  constructor(mongoInstance) {
    if (!PromoterDao._instance) {
      this.mongo = mongoInstance;
      this.collection = this.mongo.db.collection("promoter");
      PromoterDao._instance = this;
    }
    return PromoterDao._instance;
  }

  readPromoters = async (projectionFields) => {
    try {
      return await this.collection
        .find({}, { projection: projectionFields })
        .toArray();
    } catch (err) {
      throw new Error();
    }
  };

  readPromotersByFilters = async (filters, projectionFields) => {
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

  readPromoterById = async (id, projectionFields) => {
    try {
      return await this.collection.findOne(
        { _id: this.mongo.ObjectId(id) },
        { projection: projectionFields }
      );
    } catch (err) {
      throw new Error();
    }
  };

  createPromoter = async (eventManager) => {
    try {
      return await this.collection.insertOne(eventManager);
    } catch (err) {
      throw new Error();
    }
  };

  updatePromoter = async (id, eventManager) => {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: this.mongo.ObjectId(id) },
        { $set: { ...eventManager } },
        { returnDocument: "after" }
      );
    } catch (err) {
      throw new Error();
    }
  };

  deletePromoter = async (id) => {
    try {
      return await this.collection.deleteOne({ _id: this.mongo.ObjectId(id) });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = PromoterDao;
