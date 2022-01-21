"use strict";

const fp = require("fastify-plugin");
const isDocker = require("is-docker");
const { objToTwoDots } = require("../util/functions")

const redisPlugin = async function (fastify, opts) {

    const host = isDocker() ? process.env.REDIS_HOST_DOCKER : process.env.REDIS_HOST;
    await fastify.register(require("fastify-redis"), { host })

    const generateKeyFromFilterUtils = (m, o, f, p) => {
        const filters = objToTwoDots(f.getWhere());
        const fields = objToTwoDots(p);

        let opts = {};
        const sort = f.getSort();
        if (sort && Object.keys(sort).length) opts.sort = sort;
        const offset = f.getOffset();
        if (offset > -1) opts.skip = offset;
        const limit = f.getLimit();
        if (limit > 0) opts.limit = limit;

        const options = objToTwoDots(opts)

        let finalKey = m + '-' + o;
        if (filters) finalKey = finalKey + '-' + filters;
        if (fields) finalKey = finalKey + '-' + fields;
        if (options) finalKey = finalKey + '-' + options;
        return finalKey;
    }

    const generateKeyFromMongoQuery = (q) => {
        const serviceQueryName = q.serviceQueryName;
        const model = q.mongooseCollection.modelName;
        const filters = objToTwoDots(q.getFilter());
        const fields = objToTwoDots(q._fields);
        const options = objToTwoDots(q.getOptions());

        let finalKey = model + '-' + serviceQueryName;
        if (filters) finalKey = finalKey + '-' + filters;
        if (fields) finalKey = finalKey + '-' + fields;
        if (options) finalKey = finalKey + '-' + options;
        
        return finalKey;
    }

    const deleteByPattern = (hash, pattern) => {
        const stream = fastify.redis.hscanStream(hash, {
            match: pattern
        });

        stream.on('data', (keys) => {
            if (keys.length) {
                fastify.redis.hdel(hash, keys)
            }
        })
    }

    const clearCache = (options = {}) => {
        let hash, key, rawPattern;
        const { deleteHash, deleteKey } = options;

        hash = JSON.stringify(deleteHash || 'default');
        if (Array.isArray(deleteKey) && deleteKey.length) {
            deleteKey.forEach(dk => {
                const keyArray = dk.split("-");
                if (keyArray) {
                    rawPattern = keyArray.join('-');
                    const pattern = rawPattern + "-*"
                    deleteByPattern(hash, pattern)
                }
            })
        } else {
            fastify.redis.hdel(hash, key)
        }
    };

    fastify.redis.generateKeyFromMongoQuery = generateKeyFromMongoQuery;
    fastify.redis.generateKeyFromFilterUtils = generateKeyFromFilterUtils;
    fastify.redis.deleteByPattern = deleteByPattern;
    fastify.redis.clearCache = clearCache;
}

module.exports = fp(redisPlugin, { name: 'redis' })