"use strict";

const { test } = require("tap");
const { build } = require("../helper");

const fakeCategory = {
  name: "Holiday",
  description: "Holiday events category",
  icon: "testicon.svg"
};

const updatedCategory = { ...fakeCategory, name: "Holidays" };

const wrongUpdatedCategory = {
  ...updatedCategory,
  namme: "Test tile",
};

const wrongFieldsCategory = {
  nme: "Test tile",
  startTime: new Date("2006-08-29T09:12:33.001Z").toISOString(),
};

const nonExistentId = "61af8dc11fe6423fdb9bd653";

test("Read events with projection fields.", async (t) => {
  const app = build(t);

  const fields = ["title", "description"];

  const readCategories = await app.inject({
    url: "categories",
    method: "GET",
  });
  
  const readCategoriesBody = JSON.parse(readCategories.body);
});

test("Create categories and read them", async (t) => {
  const app = build(t);

  const category1 = await app.inject({
    url: "categories",
    method: "POST",
    body: fakeCategory,
  });

  t.equal(category1.statusCode, 200);

  const category2 = await app.inject({
    url: "categories",
    method: "POST",
    body: fakeCategory,
  });

  t.equal(category2.statusCode, 200);

  const readCategories = await app.inject({
    url: "categories",
    method: "GET",
  });

  const categoryBody = JSON.parse(readCategories.body);
  t.equal(categoryBody.length, 2);
});

test("Update existing event and get it. If the id is wrong should return error.", async (t) => {
  const app = build(t);

  const category = await app.inject({
    url: "categories",
    method: "POST",
    body: fakeEvent,
  });

  const createdCategoryBody = JSON.parse(category.body);
  t.equal(category.statusCode, 200);

  const updateCategory = await app.inject({
    url: "categories/" + createdCategoryBody.insertedId,
    method: "PUT",
    body: updatedCategory,
  });

  const updatedEventBody = JSON.parse(updateCategory.body);

  t.equal(updateCategory.statusCode, 200);
  t.equal(createdCategoryBody.insertedId, updatedEventBody.data._id);

  const readCategory = await app.inject({
    url: "categories/" + createdCategoryBody.insertedId,
    method: "GET",
  });

  const categoryBody = JSON.parse(readCategory.body);

  delete categoryBody["_id"];
  t.same(categoryBody, updatedCategory);

  const readNonExistentCategory = await app.inject({
    url: "categories/" + nonExistentId,
    method: "GET",
  });

  t.equal(readNonExistentCategory.statusCode, 404);
});

test("Create event then delete it", async (t) => {
  const app = build(t);

  const category = await app.inject({
    url: "categories",
    method: "POST",
    body: fakeCategory,
  });

  const createdCategoryBody = JSON.parse(category.body);
  t.equal(category.statusCode, 200);

  const deleteCategory1 = await app.inject({
    url: "categories/" + nonExistentId,
    method: "DELETE",
  });

  t.equal(deleteCategory1.statusCode, 404);

  const deleteCategory2 = await app.inject({
    url: "categories/" + createdCategoryBody.insertedId,
    method: "DELETE",
  });

  t.equal(deleteCategory2.statusCode, 200);
});

test("Creating item with no fields defined in schema should throw error.", async (t) => {
  const app = build(t);

  const createCategory = await app.inject({
    url: "categories/",
    method: "POST",
    body: wrongFieldsCategory
  });

  t.equal(createCategory.statusCode, 400);
});

test("Updating item that does not exists should throw error.", async (t) => {
  const app = build(t);

  const updateCategory = await app.inject({
    url: "categories/" + nonExistentId,
    method: "PUT",
    body: updatedCategory,
  });

  t.equal(updateCategory.statusCode, 404);
});

test("Updating item with wrong fields should throw error", async (t) => {
  const app = build(t);

  const category = await app.inject({
    url: "categories",
    method: "POST",
    body: fakeCategory,
  });

  const createdEventBody = JSON.parse(category.body);
  t.equal(category.statusCode, 200);

  const updateCategory1 = await app.inject({
    url: "categories/" + createdEventBody.insertedId,
    method: "PUT",
    body: wrongFieldsCategory,
  });

  t.equal(updateCategory1.statusCode, 400);

  const updateCategory2 = await app.inject({
    url: "categories/" + createdEventBody.insertedId,
    method: "PUT",
    body: wrongUpdatedCategory,
  });

  t.equal(updateCategory2.statusCode, 200);
});
