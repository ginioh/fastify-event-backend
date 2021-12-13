const getProjectionFields = (qsRequest, schema) => {
  let projectionFields = {};

  if ("fields" in qsRequest) {
    const { fields } = qsRequest;
    const queryString = fields.split(",");
    const schemaFields = schema.valueOf().properties;

    queryString.forEach((qs) => {
      if (qs && Object.keys(schemaFields).indexOf(qs) > -1) {
        projectionFields[qs] = 1;
      }
    }, this);
  }
  return projectionFields;
};

module.exports = { getProjectionFields };
