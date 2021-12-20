"use strict";

class PromoterDao {
  constructor(mongoInstance) {
    if (!PromoterDao._instance) {
      this.mongo = mongoInstance;
      // this.collection = this.mongo.db.collection("promoter");
      PromoterDao._instance = this;
    }
    return PromoterDao._instance;
  }

  readPromoters = async (projectionFields) => {
    try {
      return await this.mongo.find({}).select(projectionFields);
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  readPromotersByFilters = async (filters, projectionFields) => {
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

  readPromoterById = async (id, projectionFields) => {
    try {
      return await this.mongo.findById(id).select({ ...projectionFields })
    } catch (err) {
      throw new Error();
    }
  };

  createPromoter = async (promoter) => {
    try {
      return await this.mongo.create(promoter);
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  updatePromoter = async (id, promoter) => {
    try {
      return await this.mongo.findByIdAndUpdate(
        id,
        promoter,
        { new: true }
      );
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  deletePromoter = async (id) => {
    try {
      return await this.mongo.deleteOne({ _id: id });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = PromoterDao;
