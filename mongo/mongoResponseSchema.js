const mongoCreateSchema = () => {
  return {
    acknowledged: { type: "boolean" },
    insertedId: { type: "string" },
  };
};

const mongoUpdateSchema = (itemProperties) => {
  if (itemProperties && Object.keys(itemProperties).length) {
    return {
      lastErrorObject: {
        type: "object",
        properties: {
          n: { type: "number" },
          updatedExisting: { type: "boolean" },
        },
      },
      value: { type: "object", properties: itemProperties, nullable: true },
      ok: { type: "number" },
    };
  } else throw Error();
};

module.exports = {
  mongoCreateSchema,
  mongoUpdateSchema,
};
