"use strict";

const { test } = require("tap");
const { build } = require("../helper");

const fakeEvent = {
  title: "A subject",
  description: "A ticket body",
  featuredImage: "http://localhost:3000/public/test.png",
  category: "61af8dc11fe6423fdb9bd653",
  startDate: new Date("2006-08-29T09:12:33.001Z").toISOString(),
  endDate: new Date("2006-08-29T10:12:33.001Z").toISOString(),
};

const updatedEvent = { ...fakeEvent, title: "Updated event" };

const wrongUpdatedEvent = {
  ...updatedEvent,
  tile: "Test tile",
};

const wrongFieldsEvent = {
  tile: "Test tile",
  startTime: new Date("2006-08-29T09:12:33.001Z").toISOString(),
};

const nonExistentId = "61af8dc11fe6423fdb9bd653";

test("Read events with projection fields.", async (t) => {
  const app = build(t);

  const fields = ["title", "description"];

  const readEvents = await app.inject({
    url: `events?fields=${fields.join(',')}`,
    method: "GET",
  });
  
  const readEventsBody = JSON.parse(readEvents.body);
});

test("Create events and read them", async (t) => {
  const app = build(t);

  const event1 = await app.inject({
    url: "events",
    method: "POST",
    body: fakeEvent,
  });

  t.equal(event1.statusCode, 200);

  const event2 = await app.inject({
    url: "events",
    method: "POST",
    body: fakeEvent,
  });

  t.equal(event2.statusCode, 200);

  const readEvents = await app.inject({
    url: "events",
    method: "GET",
  });

  const eventBody = JSON.parse(readEvents.body);
  t.equal(eventBody.length, 2);
});

test("Update existing event and get it. If the id is wrong should return error.", async (t) => {
  const app = build(t);

  const event = await app.inject({
    url: "events",
    method: "POST",
    body: fakeEvent,
  });

  const createdEventBody = JSON.parse(event.body);
  t.equal(event.statusCode, 200);

  const updateEvent = await app.inject({
    url: "events/" + createdEventBody.insertedId,
    method: "PUT",
    body: updatedEvent,
  });

  const updatedEventBody = JSON.parse(updateEvent.body);

  t.equal(updateEvent.statusCode, 200);
  t.equal(createdEventBody.insertedId, updatedEventBody.data._id);

  // delete updatedEventBody.value['_id'];

  const readEvent = await app.inject({
    url: "events/" + createdEventBody.insertedId,
    method: "GET",
  });

  const eventBody = JSON.parse(readEvent.body);

  delete eventBody["_id"];
  t.same(eventBody, updatedEvent);

  const readNonExistentEvent = await app.inject({
    url: "events/" + nonExistentId,
    method: "GET",
  });

  t.equal(readNonExistentEvent.statusCode, 404);
});

test("Create event then delete it", async (t) => {
  const app = build(t);

  const event = await app.inject({
    url: "events",
    method: "POST",
    body: fakeEvent,
  });

  const createdEventBody = JSON.parse(event.body);
  t.equal(event.statusCode, 200);

  const deleteEvent1 = await app.inject({
    url: "events/" + nonExistentId,
    method: "DELETE",
  });

  t.equal(deleteEvent1.statusCode, 404);

  const deleteEvent2 = await app.inject({
    url: "events/" + createdEventBody.insertedId,
    method: "DELETE",
  });

  t.equal(deleteEvent2.statusCode, 200);
});

test("Creating item with no fields defined in schema should throw error.", async (t) => {
  const app = build(t);

  const createEvent = await app.inject({
    url: "events/",
    method: "POST",
    body: wrongFieldsEvent,
  });

  t.equal(createEvent.statusCode, 400);
});

test("Updating item that does not exists should throw error.", async (t) => {
  const app = build(t);

  const updateEvent = await app.inject({
    url: "events/" + nonExistentId,
    method: "PUT",
    body: updatedEvent,
  });

  t.equal(updateEvent.statusCode, 404);
});

test("Updating item with wrong fields should throw error", async (t) => {
  const app = build(t);

  const event = await app.inject({
    url: "events",
    method: "POST",
    body: fakeEvent,
  });

  const createdEventBody = JSON.parse(event.body);
  t.equal(event.statusCode, 200);

  const updateEvent1 = await app.inject({
    url: "events/" + createdEventBody.insertedId,
    method: "PUT",
    body: wrongFieldsEvent,
  });

  t.equal(updateEvent1.statusCode, 400);

  const updateEvent2 = await app.inject({
    url: "events/" + createdEventBody.insertedId,
    method: "PUT",
    body: wrongUpdatedEvent,
  });

  t.equal(updateEvent2.statusCode, 200);
});
