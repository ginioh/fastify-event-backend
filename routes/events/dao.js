const events = require(".");

class EventDao {
  constructor(mongoInstance) {
    this.mongo = mongoInstance;
    this.collection = this.mongo.db.collection("event");
  }

  readEvents = async (projectionFields) =>
    await this.collection.find({}, { projection: projectionFields }).toArray();

  readEventsByFilters = async (filters, projectionFields) => {
    return await this.collection
      .find({ ...filters.getWhere() }, { projection: projectionFields })
      .sort({ ...filters.getSort() })
      .limit(filters.getLimit())
      .toArray();
  };

  readEventById = async (id, projectionFields) =>
    await this.collection.findOne(
      { _id: this.mongo.ObjectId(id) },
      { projection: projectionFields }
    );

  createEvent = async (event) => await this.collection.insertOne(event);

  updateEvent = async (id, event) =>
    await this.collection.findOneAndUpdate(
      { _id: this.mongo.ObjectId(id) },
      { $set: { ...event } },
      { returnDocument: "after" }
    );

  deleteEvent = async (id) =>
    await this.collection.deleteOne({ _id: this.mongo.ObjectId(id) });
}

module.exports = EventDao;
