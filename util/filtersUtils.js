class FiltersUtils {
  constructor(queryString, schema) {
    this.queryString = queryString;
    this.schema = schema;
    this.where = {};
    this.sort = {};
    this.offset = 0;
    this.limit = 0;

    if (Object.keys(queryString).length) {
      this._buildWhere();
      this._buildSort();
      this._buildOffset();
      this._buildLimit();
    }
  }

  _buildWhere = () => {
    const schemaFields = this.schema.valueOf().properties;
    Object.keys(schemaFields).forEach((f) => {
      if (f && Object.keys(this.queryString).indexOf(f) > -1) {
        this.where[f] = this.queryString[f];
      }
    });
  };

  _buildSort = () => {
    if (this.queryString.sort) {
      const sortItems = this.queryString.sort.split(".");
      if (sortItems.length === 2) {
        let directionValue;
        if (sortItems[1] === "asc") directionValue = -1;
        if (sortItems[1] === "desc") directionValue = 1;
        this.sort = {
          [sortItems[0]]: directionValue,
        };
      }
    }
  };

  _buildOffset = () => {
    if (this.queryString.offset) this.offset = parseInt(this.queryString.offset);
  };

  _buildLimit = () => {
    if (this.queryString.limit) this.limit = parseInt(this.queryString.limit);
  };

  isFilterableQuery = () => {
    if (
      Object.keys(this.where).length ||
      Object.keys(this.sort).length ||
      this.limit
    ) {
      return true;
    }
    return false;
  };

  getWhere = () => this.where;
  getSort = () => this.sort;
  getLimit = () => this.limit;
  getOffset = () => this.offset;
}

module.exports = FiltersUtils;
