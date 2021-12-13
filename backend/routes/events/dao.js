class EventDao {
  constructor(mongoInstance) {
    if (!EventDao._instance) {
      this.mongo = mongoInstance;
      this.collection = this.mongo.db.collection("event");
      EventDao._instance = this;
    }
    return EventDao._instance;
  }

  readEvents = async (projectionFields) => {
    try {
      return await this.collection
        .find({}, { projection: projectionFields })
        .toArray();
    } catch (err) {
      throw new Error();
    }
  };

  readEventsByFilters = async (filters, projectionFields) => {
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

  readEventById = async (id, projectionFields) => {
    try {
      return await this.collection.findOne(
        { _id: this.mongo.ObjectId(id) },
        { projection: projectionFields }
      );
    } catch (err) {
      throw new Error();
    }
  };

  createEvent = async (event) => {
    try {
      return await this.collection.insertOne(event);
    } catch (err) {
      throw new Error();
    }
  };

  updateEvent = async (id, event) => {
    try {
      return await this.collection.findOneAndUpdate(
        { _id: this.mongo.ObjectId(id) },
        { $set: { ...event } },
        { returnDocument: "after" }
      );
    } catch (err) {
      throw new Error();
    }
  };

  deleteEvent = async (id) => {
    try {
      return await this.collection.deleteOne({ _id: this.mongo.ObjectId(id) });
    } catch (err) {
      throw new Error();
    }
  };
}

module.exports = EventDao;
