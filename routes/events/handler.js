"use strict";

const { eventSchema } = require("./schema");
const { getProjectionFields } = require("../../util/mongoUtils");
const { getAccessTokenFromHeader, slugify } = require("../../util/functions");
const FilterUtils = require("../../util/filtersUtils");
const { AuthorizationException } = require("../../common/exceptions/auth/AuthorizationException");
const { writeFile } = require("../../util/fileUtils");

async function createEvent(req, res) {

    const { models: { eventModel, categoryModel, promoterModel }, keycloak, redis } = this;

    // const { body } = req;
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

    body.slug = slugify(body.title);

    const event = await eventModel.findOne({ slug: body.slug })
    if (event) throw new Error("Event already exists.");

    const category = await categoryModel.findById(body.category).select({ _id: 1, name: 1 });
    if (!category) throw new Error("Should specify an existing category.");

    const promoter = await promoterModel.findById(body.promoter).select({ _id: 1, name: 1 });
    if (!promoter) throw new Error("Should specify an existing promoter.");

    const token = getAccessTokenFromHeader(req);
    if (token) {
        const userInfo = await keycloak.userinfo(token);
        if (userInfo?.sub) {
            body.createdBy = userInfo.sub;
        } else throw new AuthorizationException();
    } else throw new AuthorizationException();

    try {
        const result = await eventModel.create(body);
        redis.clearCache({
            deleteHash: "events",
            deleteKey: ["event-find"]
        })
        return {
            item: result,
            message: req.t('CREATE_EVENT')
        };
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }


}
async function readEvents(req, res) {
    const { eventModel } = this.models;
    // const paginate = eventModel.paginate;

    // const find = eventModel.Query.prototype.find;

    // eventModel.Query.prototype.find = function (options = {}) {
    //     this.enableCache = true;
    //     this.hashKey = 'events';
    //     return find(this);
    // };

    // eventModel.paginate = async function (filters, options = {}) {
    //     console.log('filters', filters)
    //     console.log('options', options)
    //     console.log('cached', this.enableCache)
    //     if (!this.enableCache) {
    //         return await paginate(filters.getWhere(), options);
    //     }

    //     const key = redis.generateKeyFromMongoQuery(this);

    //     const cachedValue = await redis.hget(this.hashKey, key);

    //     if (cachedValue) {
    //         const parsedCache = JSON.parse(cachedValue);
    //         return parsedCache;
    //     }

    //     const result = await paginate(filters.getWhere(), options);

    //     redis.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 1800);

    //     return result;
    // }

    try {
        const { query } = req;
        const projectionFields = getProjectionFields(query, eventSchema);
        const populatedFields = () => {
            const possiblePopulatedFields = ['category', 'promoter']
            if (Object.keys(projectionFields).length) {
                return possiblePopulatedFields.filter(f => Object.keys(projectionFields).indexOf(f) > -1);
            }
            return possiblePopulatedFields;
        }
        const filters = new FilterUtils(query, eventSchema);
        if (filters.isFilterableQuery()) {
            const options = {
                select: projectionFields,
                sort: filters.getSort(),
                populate: populatedFields(),
                offset: filters.getOffset(),
                limit: filters.getLimit()
            }
            return await eventModel.paginate(filters.getWhere(), options);

            // return await eventModel
            //     .find({ ...filters.getWhere() })
            //     .select({ ...projectionFields })
            //     .sort({ ...filters.getSort() })
            //     .skip(filters.getOffset())
            //     .limit(filters.getLimit())
            //     .cache()
            // .populate('category')
            // .populate('promoter')
        }
        const docs = await eventModel.find({}).select({ ...projectionFields }).cache("readEvents");
        return {
            docs
        }
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}

async function readPublicEvents(req, res) {
    try {
        const { models: { eventModel }, keycloak } = this;
        const { query } = req;
        const projectionFields = getProjectionFields(query, eventSchema);
        const populatedFields = () => {
            const possiblePopulatedFields = ['category', 'promoter']
            if (Object.keys(projectionFields).length) {
                return possiblePopulatedFields.filter(f => Object.keys(projectionFields).indexOf(f) > -1);
            }
            return possiblePopulatedFields;
        }
        const filters = new FilterUtils(query, eventSchema);
        if (filters.isFilterableQuery()) {
            const options = {
                sort: filters.getSort(),
                populate: populatedFields(),
                offset: filters.getOffset(),
                limit: filters.getLimit()
            }
            return await eventModel.paginate({ startDate: { $gt: new Date().toISOString() } }, options);
        }
        const docs = await eventModel.find({ startDate: { $gt: new Date().toISOString() } })
        // .cache("readPublicEvents");
        return {
            docs
        }
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}

async function readMyEvents(req, res) {
    try {
        const { models: { eventModel }, keycloak } = this;
        const { query } = req;
        let userId;
        const token = getAccessTokenFromHeader(req);
        if (token) {
            const userInfo = await keycloak.userinfo(token);
            if (userInfo?.sub) {
                userId = userInfo.sub;
            } else throw new AuthorizationException();
        } else throw new AuthorizationException();

        if (userId) {
            const projectionFields = getProjectionFields(query, eventSchema);
            const populatedFields = () => {
                const possiblePopulatedFields = ['category', 'promoter']
                if (Object.keys(projectionFields).length) {
                    return possiblePopulatedFields.filter(f => Object.keys(projectionFields).indexOf(f) > -1);
                }
                return possiblePopulatedFields;
            }
            const filters = new FilterUtils(query, eventSchema);
            if (filters.isFilterableQuery()) {
                const options = {
                    sort: filters.getSort(),
                    populate: populatedFields(),
                    offset: filters.getOffset(),
                    limit: filters.getLimit()
                }
                return await eventModel.paginate({ createdBy: userId }, options)
                // return await eventModel
                //     .find({ ...filters.getWhere(), createdBy: token })
                //     .select({ ...projectionFields })
                //     .sort({ ...filters.getSort() })
                //     .skip(filters.getOffset())
                //     .limit(filters.getLimit())
                //     .populate('category')
                //     .populate('promoter')
                //     .cache("readMyEvents")
            }
            const docs = await eventModel.find({ createdBy: userId }).select({ ...projectionFields }).cache("readMyEvents");
            return { docs }
        } else {
            throw new Error('missing token')
        }
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function readEventById(req, res) {
    const { eventModel } = this.models;

    try {
        const { query, params: { id } } = req;
        const projectionFields = getProjectionFields(query, eventSchema);
        return await eventModel.findById(id).select({ ...projectionFields }).populate(['category', 'promoter']).cache("readEventById");
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function updateEvent(req, res) {
    try {
        const { models: { eventModel, categoryModel, promoterModel }, keycloak } = this;
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

        body.slug = slugify(body.title);

        if (body.category) {
            const category = await categoryModel.findById(body.category).select({ _id: 1, name: 1 });
            if (!category) throw new Error("Should specify an existing category.");
        }
        if (body.promoter) {
            const promoter = await promoterModel.findById(body.promoter).select({ _id: 1, name: 1 });
            if (!promoter) throw new Error("Should specify an existing promoter.");
        }

        const token = getAccessTokenFromHeader(req);
        if (token) {
            const userInfo = await keycloak.userinfo(token);
            if (userInfo?.sub) {
                body.updatedBy = userInfo.sub;
            } else throw new AuthorizationException();
        } else throw new AuthorizationException();

        const result = await eventModel.findByIdAndUpdate(id, body, { new: true }).clearCache({
            deleteHash: "events",
            deleteKey: ["event-find", `event-findOne-_id:${id}`]
        });
        return {
            item: result,
            message: req.t("UPDATE_EVENT"),
        };
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}
async function deleteEvent(req, res) {
    try {
        const { eventModel } = this.models;

        const { id } = req.params;
        const result = await eventModel.findByIdAndDelete(id).clearCache({
            deleteHash: "events",
            deleteKey: ["event:find", `event:findOne:_id:${id}`]
        });;
        if (result) {
            return {
                message: req.t("DELETE_EVENT"),
            };
        } else throw new Error();
    } catch (e) {
        // TODO: Implement error handling
        console.log(e)
        throw new Error();
    }
}

module.exports = { readEvents, readPublicEvents, readMyEvents, readEventById, createEvent, updateEvent, deleteEvent }