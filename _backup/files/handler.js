const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

const UPLOAD_PATH = path.join(path.resolve(), 'uploads');


async function uploadFile(req, res) {
    const parts = await req.parts();
    // const data = await req.files();
    // console.log(req.body)
    // if (data == undefined) {
    //     return res.status(400).send({ message: "Please upload a file!" });
    // }
    // console.log('data', data.toBuffer())

    // S3 config
    // const params = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: data.filename, // File name you want to save as in S3
    //     Body: data.file
    // };
    // await s3.upload(params, function (err, data) {
    //     if (err) {
    //         console.log('err', err)
    //         throw new Error();
    //     }
    // });
    // return {
    //     message: req.t("FILE_UPLOAD_SUCCESS")
    // }
    for await (const p of parts) {
        if (p.mimetype?.startsWith('image/')) {
            try {
                await pump(p.file, fs.createWriteStream(path.join(UPLOAD_PATH, p.filename)))
            } catch (e) {
                console.log(e)
            }
        }
        if (p.fieldname === "document") {
            const document = JSON.parse(p.value)
        }
    }

    // for await (const d of data) {
    //     console.log('d', d)
    //     if (d.mimetype === "application/json" && d.fieldname === "document") {
    //         // console.log('doc', d.fields.document)
    //     }
    //     try {
    //         await pump(d.file, fs.createWriteStream(path.join(UPLOAD_PATH, d.filename)))
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    return {
        message: req.t("FILE_UPLOAD_SUCCESS")
    }
}
// readFile: async (req, res) => {
//     const { filename } = req.params;
//     const data = s3.getObject(
//         {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: filename
//         }

//     ).promise();
//     return data;
// }

module.exports = { uploadFile }