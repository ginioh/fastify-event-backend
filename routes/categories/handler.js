"use strict";

const { categorySchema } = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const FilterUtils = require("../../util/filtersUtils");

async function createCategory(req, res) {
    try {
        const { categoryModel } = this.models;
        const { body } = req;
        const result = await categoryModel.create(body)
        return {
            item: result,
            message: req.t('CREATE_CATEGORY')
        };
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function readCategories(req, res) {
    try {
        const { categoryModel } = this.models;
        const { query } = req;
        const projectionFields = getProjectionFields(query, categorySchema);
        const filters = new FilterUtils(query, categorySchema);
        if (filters.isFilterableQuery()) {
            const options = {
                select: projectionFields,
                sort: filters.getSort(),
                offset: filters.getOffset(),
                limit: filters.getLimit()
            }
            return await categoryModel.paginate(filters.getWhere(), options);
            // return await categoryModel
            //     .find({ ...filters.getWhere() })
            //     .select({ ...projectionFields })
            //     .sort({ ...filters.getSort() })
            //     .limit(filters.getLimit())
            //     .populate('category')
            //     .populate('promoter')
        }
        const docs = await categoryModel.find({}).select({ ...projectionFields });
        return { docs }
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function readCategoryById(req, res) {
    try {
        const { categoryModel } = this.models;
        const { query, params: { id } } = req;
        const projectionFields = getProjectionFields(query, categorySchema);
        return await categoryModel.findById(id).select({ ...projectionFields });
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function updateCategory(req, res) {
    try {
        const { categoryModel } = this.models;
        const { body, params: { id } } = req;
        const result = await categoryModel.findByIdAndUpdate(id, body);
        return {
            item: result,
            message: req.t("UPDATE_CATEGORY"),
        };
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function deleteCategory(req, res) {
    try {
        const { categoryModel } = this.models;
        const { id } = req.params;
        const result = await categoryModel.findByIdAndDelete(id);
        if (result) {
            return {
                message: req.t("DELETE_CATEGORY"),
            };
        } else throw new Error();
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}

module.exports = { readCategories, readCategoryById, createCategory, updateCategory, deleteCategory }