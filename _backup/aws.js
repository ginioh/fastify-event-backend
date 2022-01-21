"use strict";

const fp = require("fastify-plugin")
const AWS = require('aws-sdk');

const awsPlugin = async (fastify, opts) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    });

    fastify.decorate('s3', s3);
};

module.exports = fp(awsPlugin)