class EventManagerDao {
  constructor(mongoInstance) {
    if (!EventManagerDao._instance) {
      this.mongo = mongoInstance;
      this.collection = this.mongo.db.collection("eventManager");
      EventManagerDao._instance = this;
    }
    return EventManagerDao._instance;
  }

  readEventManagers = async (projectionFields) => {
    try {
      await this.collection
        .find({}, { projection: projectionFields })
        .toArray();
    } catch (err) {
      throw new Error();
    }
  };

  readEventManagersByFilters = async (filters, projectionFields) => {
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

  readEventManagerById = async (id, projectionFields) => {
    try {
      return await this.collection.findOne(
        { _id: this.mongo.ObjectId(id) },
        { projection: projectionFields }
      );
    } catch (err) {
      throw new Error();
    }
  };

  createEventManager = async (eventManager) => {
    try {
      return await this.collection.insertOne(eventManager);
    } catch (err) {
      throw new Error();
    }
  };

  updateEventManager = async (id, eventManager) => {
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

  deleteEventManager = async (id) => {
    try {
      return await this.collection.deleteOne({ _id: this.mongo.ObjectId(id) });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = EventManagerDao;
