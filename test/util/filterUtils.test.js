const { test } = require("tap");
const FiltersUtils = require("../../util/filtersUtils");
const { eventSchema } = require("../../routes/events/schema");

const rightWhere = { title: "Test title" };
const rightSort = { sort: "title.asc" };
const rightLimit = { limit: 10 };

const wrongSort = { sort: "titleasc" };
const wrongLimit = { limit: "abc" };

test("Should construct FilterUtils class given request query string.", async (t) => {
  const filterUtils = new FiltersUtils(
    { ...rightWhere, ...rightSort, ...rightLimit },
    eventSchema
  );

  t.match(filterUtils.getWhere(), rightWhere);
  t.match(filterUtils.getSort(), { title: -1 });
  t.match(filterUtils.getLimit(), 10);
  t.equal(filterUtils.isFilterableQuery(), true);
});
