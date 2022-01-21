"use strict";

const { promoterSchema } = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const { slugify } = require("../../util/functions");
const FilterUtils = require("../../util/filtersUtils");
const { writeFile } = require("../../util/fileUtils");

async function createPromoter(req, res) {
    const { models: { promoterModel } } = this;
    try {
        let body;
        const parts = await req.parts();
        for await (const p of parts) {
            if (p.mimetype?.startsWith('image/')) {
                await writeFile(p.file, p.filename)
            }
            if (p.fieldname === "document") {
                body = JSON.parse(p.value)
            }
        }

        body.slug = slugify(body.name);

        const promoter = await promoterModel.findOne({ slug: body.slug })
        if (promoter) throw new Error("Event already exists.");

        const result = await promoterModel.create(body)
        return {
            item: result,
            message: req.t('CREATE_PROMOTER')
        };
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function readPromoters(req, res) {
    const { models: { promoterModel } } = this;
    try {
        const { query } = req;
        const projectionFields = getProjectionFields(query, promoterSchema);
        const filters = new FilterUtils(query, promoterSchema);
        if (filters.isFilterableQuery()) {
            const options = {
                select: projectionFields,
                sort: filters.getSort(),
                offset: filters.getOffset(),
                limit: filters.getLimit()
            }
            return await promoterModel.paginate(filters.getWhere(), options);
            // return await promoterModel
            //     .find({ ...filters.getWhere() })
            //     .select({ ...projectionFields })
            //     .sort({ ...filters.getSort() })
            //     .limit(filters.getLimit())
        }
        const docs = await promoterModel.find({}).select({ ...projectionFields });
        return {
            docs
        }
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function readPromoterById(req, res) {
    const { models: { promoterModel } } = this;
    try {
        const { query, params: { id } } = req;
        const projectionFields = getProjectionFields(query, promoterSchema);
        return await promoterModel.findById(id).select({ ...projectionFields });
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function updatePromoter(req, res) {
    const { models: { promoterModel } } = this;
    try {
        const { id } = req.params;
        let body;
        const parts = await req.parts();
        for await (const p of parts) {
            if (p.mimetype?.startsWith('image/')) {
                await writeFile(p.file, p.filename)
            }
            if (p.fieldname === "document") {
                body = JSON.parse(p.value)
            }
        }

        const result = await promoterModel.findByIdAndUpdate(id, body, { new: true });
        return {
            item: result,
            message: req.t("UPDATE_PROMOTER"),
        };
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function deletePromoter(req, res) {
    const { models: { promoterModel } } = this;
    try {
        const { id } = req.params;
        const result = await promoterModel.findByIdAndDelete(id);
        if (result) {
            return {
                message: req.t("DELETE_PROMOTER"),
            };
        } else throw new Error();
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}

module.exports = { createPromoter, readPromoters, readPromoterById, updatePromoter, deletePromoter }