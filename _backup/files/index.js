"use strict";

const { uploadFile } = require("./handler")

module.exports = async (fastify, opts) => {

    // ROUTES //

    fastify.post("/", { 
        // onRequest: fastify.protect 
    }, uploadFile);

    // fastify.get("/:filename", {}, service.readFile);

    // fastify.get("/", {}, async (req, res) => {
    //     return await service.readFiles();
    // });

    // fastify.get("/:filename", {}, async (req, res) => {
    //     const { filename } = req.params;
    //     return await res.sendFile(res, filename);
    // });

    // fastify.post("/upload", {}, async (req, res) => {
    //     const data = await req.file();
    //     await service.uploadFile(res, data);
    //     return {
    //         message: req.t("FILE_UPLOAD_SUCCESS")
    //     }
    // });

    // fastify.post("/multiupload", {}, async (req, res) => {
    //     const data = await req.files();
    //     for await (const d of data) {
    //         await service.uploadFile(res, d)
    //     }
    //     return {
    //         message: req.t("FILE_MULTIUPLOAD_SUCCESS")
    //     }
    // });
}