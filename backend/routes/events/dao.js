"use strict";

class EventDao {
  constructor(mongoInstance) {
    if (!EventDao._instance) {
      this.mongo = mongoInstance;
      EventDao._instance = this;
    }
    return EventDao._instance;
  }

  readEvents = async (projectionFields) => {
    try {
      return await this.mongo.find({}).select(projectionFields).populate('category')
        .populate('promoter');
    } catch (err) {
      throw new Error();
    }
  };

  readEventsByFilters = async (filters, projectionFields) => {
    try {
      return await this.mongo
        .find({ ...filters.getWhere() })
        .select({ ...projectionFields })
        .sort({ ...filters.getSort() })
        .limit(filters.getLimit())
        .populate('category')
        .populate('promoter')
    } catch (err) {
      throw new Error();
    }
  };

  readEventById = async (id, projectionFields) => {
    try {
      return await this.mongo.findById(id).select({ ...projectionFields }).populate('category')
        .populate('promoter');
    } catch (err) {
      throw new Error();
    }
  };

  createEvent = async (event) => {
    try {
      return await this.mongo.create(event);
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  updateEvent = async (id, event) => {
    try {
      return await this.mongo.findByIdAndUpdate(
        id,
        event,
        { new: true }
      );
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  };

  deleteEvent = async (id) => {
    try {
      return await this.mongo.deleteOne({ _id: id });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = EventDao;
