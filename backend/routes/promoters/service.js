"use strict";

const {
  ResourceNotFoundException,
} = require("../../common/exceptions/db/ResourceNotFoundException");
const PromoterDao = require("./dao");

class PromoterService {
  constructor(mongoInstance) {
    this.dao = new PromoterDao(mongoInstance);
  }

  readPromoters = async (projectionFields) => await this.dao.readPromoters(projectionFields);

  readPromotersByFilters = async (filters, projectionFields) => await this.dao.readPromotersByFilters(filters, projectionFields);

  readPromoterById = async (id, projectionFields) => await this.dao.readPromoterById(id, projectionFields);

  createPromoter = async (promoter) => await this.dao.createPromoter(promoter);

  updatePromoter = async (id, promoter) => await this.dao.updatePromoter(id, promoter);

  deletePromoter = async (id) => await this.dao.deletePromoter(id);
}

module.exports = PromoterService;
