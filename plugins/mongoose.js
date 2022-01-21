"use strict";

const fp = require("fastify-plugin");
const isDocker = require("is-docker");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Event = require("../routes/events/model");
const Category = require("../routes/categories/model");
const Promoter = require("../routes/promoters/model");

const mongoosePlugin = async function (fastify, opts) {

    const { redis } = fastify;
    const uri = isDocker() ? process.env.MONGO_URL_DOCKER : process.env.MONGO_URL;

    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })

        const exec = mongoose.Query.prototype.exec;

        mongoose.Query.prototype.exec = async function () {
            if (!this.enableCache) {
                return exec.apply(this, arguments);
            }

            const key = redis.generateKeyFromMongoQuery(this);
            
            const cachedValue = await redis.hget(this.hashKey, key);

            if (cachedValue) {
                const parsedCache = JSON.parse(cachedValue);
                return parsedCache;
            }

            // Transform "key=value" format to object
            Object.keys(this._conditions).forEach(k => {
                if (this._conditions[k].indexOf("=") > -1) {
                    const splitted = this._conditions[k].split("=")
                    this._conditions[k] = {
                        [splitted[0]]: splitted[1]
                    }
                }
            })

            const result = await exec.apply(this, arguments);

            redis.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 1800);

            return result;
        };

        mongoose.Query.prototype.cache = function (serviceQueryName, options = {}) {
            if (!serviceQueryName) throw new Error();
            this.enableCache = true;
            this.hashKey = JSON.stringify(this.mongooseCollection.collectionName || options.key || 'default');
            this.serviceQueryName = serviceQueryName;
            return this;
        };

        mongoose.Query.prototype.clearCache = function (options = {}) {
            let hash, key, rawPattern;
            const { deleteHash, deleteKey } = options;

            hash = JSON.stringify(deleteHash || 'default');
            if (Array.isArray(deleteKey) && deleteKey.length) {
                deleteKey.forEach(dk => {
                    const keyArray = dk.split("-");
                    if (keyArray) {
                        rawPattern = keyArray.join('-');
                        const pattern = rawPattern + "-*"
                        redis.deleteByPattern(hash, pattern)
                    }
                })
            } else {
                redis.hdel(hash, key)
            }
            return this;
        };

        Event.plugin(mongoosePaginate);
        Category.plugin(mongoosePaginate);
        Promoter.plugin(mongoosePaginate);
        const eventModel = mongoose.model('event', Event);
        const categoryModel = mongoose.model('category', Category);
        const promoterModel = mongoose.model('promoter', Promoter);

        const models = {
            eventModel, categoryModel, promoterModel
        }

        fastify.decorate('models', models);
    } catch (e) {
        console.log(e)
    }
}

module.exports = fp(mongoosePlugin, { name: 'mongoose', dependencies: ['redis'] })