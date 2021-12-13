"use strict";

const { test } = require("tap");
const { build } = require("../helper");

const fakeEventManager = {
  name: "Eugenio Ciaglia",
  email: "eugenio.ciaglia@gmail.com",
};

const updatedEventManager = { ...fakeEventManager, description: "Developer" };

const wrongUpdatedEventManager = {
  ...updatedEventManager,
  namme: "Ugo Fantozzi",
};

const wrongFieldsEventManager = {
  nme: "Ugo Fantozzi",
  address: "viale Tavoliello, 100"
};

const nonExistentId = "61af8dc11fe6423fdb9bd653";

test("Read event managers with projection fields.", async (t) => {
  const app = build(t);

  const fields = ["name", "email"];

  const readEventManagers = await app.inject({
    url: "eventManagers",
    method: "GET",
  });
  
  const readEventManagersBody = JSON.parse(readEventManagers.body);
});

test("Create event managers and read them", async (t) => {
  const app = build(t);

  const eventManager1 = await app.inject({
    url: "eventManagers",
    method: "POST",
    body: fakeEventManager,
  });

  t.equal(eventManager1.statusCode, 200);

  const eventManager2 = await app.inject({
    url: "eventManagers",
    method: "POST",
    body: fakeEventManager,
  });

  t.equal(eventManager2.statusCode, 200);

  const readEventManagers = await app.inject({
    url: "eventManagers",
    method: "GET",
  });

  const eventManagersBody = JSON.parse(readEventManagers.body);
  t.equal(eventManagersBody.length, 2);
});

test("Update existing event manager and get it. If the id is wrong should return error.", async (t) => {
  const app = build(t);

  const eventManager = await app.inject({
    url: "eventManagers",
    method: "POST",
    body: fakeEventManager,
  });

  const createdEventManagerBody = JSON.parse(eventManager.body);
  t.equal(eventManager.statusCode, 200);

  const updateEventManager = await app.inject({
    url: "eventManagers/" + createdEventManagerBody.insertedId,
    method: "PUT",
    body: updatedEventManager,
  });

  const updatedEventBody = JSON.parse(updateEventManager.body);

  t.equal(updateEvent.statusCode, 200);
  t.equal(createdEventManagerBody.insertedId, updatedEventBody.data._id);

  // delete updatedEventBody.value['_id'];

  const readEventManager = await app.inject({
    url: "eventManagers/" + createdEventManagerBody.insertedId,
    method: "GET",
  });

  const eventManagerBody = JSON.parse(readEventManager.body);

  delete eventManagerBody["_id"];
  t.same(eventManagerBody, updatedEventManager);

  const readNonExistentEvent = await app.inject({
    url: "eventManagers/" + nonExistentId,
    method: "GET",
  });

  t.equal(readNonExistentEvent.statusCode, 404);
});

test("Create event then delete it", async (t) => {
  const app = build(t);

  const eventManager = await app.inject({
    url: "eventManagers",
    method: "POST",
    body: fakeEventManager,
  });

  const createdEventManagerBody = JSON.parse(eventManager.body);
  t.equal(eventManager.statusCode, 200);

  const deleteEventManager1 = await app.inject({
    url: "eventManagers/" + nonExistentId,
    method: "DELETE",
  });

  t.equal(deleteEventManager1.statusCode, 404);

  const deleteEventManager2 = await app.inject({
    url: "eventManagers/" + createdEventManagerBody.insertedId,
    method: "DELETE",
  });

  t.equal(deleteEventManager2.statusCode, 200);
});

test("Creating item with no fields defined in schema should throw error.", async (t) => {
  const app = build(t);

  const createEventManager = await app.inject({
    url: "eventManagers/",
    method: "POST",
    body: wrongFieldsEventManager,
  });

  t.equal(createEventManager.statusCode, 400);
});

test("Updating item that does not exists should throw error.", async (t) => {
  const app = build(t);

  const updateEventManager = await app.inject({
    url: "eventManagers/" + nonExistentId,
    method: "PUT",
    body: updatedEventManager,
  });

  t.equal(updateEventManager.statusCode, 404);
});

test("Updating item with wrong fields should throw error", async (t) => {
  const app = build(t);

  const eventManager = await app.inject({
    url: "eventManagers",
    method: "POST",
    body: fakeEventManager,
  });

  const createdEventManagerBody = JSON.parse(eventManager.body);
  t.equal(eventManager.statusCode, 200);

  const updateEventManager1 = await app.inject({
    url: "eventManagers/" + createdEventManagerBody.insertedId,
    method: "PUT",
    body: wrongFieldsEventManager,
  });

  t.equal(updateEventManager1.statusCode, 400);

  const updateEventManager2 = await app.inject({
    url: "eventManagers/" + createdEventManagerBody.insertedId,
    method: "PUT",
    body: wrongUpdatedEventManager,
  });

  t.equal(updateEventManager2.statusCode, 200);
});
