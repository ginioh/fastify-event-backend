const { test } = require("tap");
const { eventSchema } = require("../../routes/events/schema");
const { getProjectionFields } = require("../../util/mongoUtils");

const rightQsRequest = {
    fields: "title,description"
}

test('Should construct projection fields object.', async (t) => {
    t.match(getProjectionFields(rightQsRequest, eventSchema), {title: 1, description: 1});
})