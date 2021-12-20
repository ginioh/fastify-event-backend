"use strict";

const fp = require("fastify-plugin");
const isDocker = require("is-docker");
const Event = require("../schemas/EventSchema");
const Category = require("../schemas/CategorySchema");
const Promoter = require("../schemas/PromoterSchema");

const mongoosePlugin = async function (fastify, opts) {

    const uri = isDocker() ? process.env.MONGO_URL_DOCKER : process.env.MONGO_URL;
    // const connection = await mongoose.createConnection(uri, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     // config: {
    //     //     autoIndex: true
    //     // }
    // });
    // connection.model('event', Event);
    // connection.model('category', Category);
    // connection.model('promoter', Promoter);

    fastify.register(require("fastify-mongoose-driver").plugin,
        {
            uri,
            settings: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                config: {
                    autoIndex: true,
                },
            },
            models: [
                {
                    name: "event",
                    alias: "event",
                    schema: Event
                },
                {
                    name: "category",
                    alias: "category",
                    schema: Category,
                    // virtualize: (schema) => {
                    //     schema.virtual("event", {
                    //         ref: "event",
                    //         localField: "_id",
                    //         foreignField: "category"
                    //     })
                    // }
                },
                {
                    name: "promoter",
                    alias: "promoter",
                    schema: Promoter,
                    // virtualize: (schema) => {
                    //     schema.virtual("event", {
                    //         ref: "event",
                    //         localField: "_id",
                    //         foreignField: "promoter"
                    //     })
                    // }
                }
            ],
            useNameAndAlias: true,
        },
        (err) => {
            if (err) throw err;
        })

    // fastify.register(ff);
    // fastify.register(fm, {
    //     models: connection.models,
    //     prefix: '/api/',
    //     methods: ['get', 'post', 'put', 'delete', 'options']
    //     //     // checkAuth: async (req, reply)=>{
    //     //     //   let ac = await this.db.AuthCode.findOne({authCode: req.cookies.authCode}).populate('user').exec(); /// fastify-cookie plugin for req.cookie
    //     //     //   if (!ac || !ac.user) {
    //     //     //     throw new Error('You are not authorized to be here');
    //     //     //   }
    //     //     // }
    // });
    require("fastify-mongoose-driver").decorator();
}

module.exports = fp(mongoosePlugin, { name: 'mongoose' })