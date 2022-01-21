const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

class FileService {

    constructor() {
        this.uploadPath = path.join(path.resolve(), 'uploads');
    }

    readFiles = async (res) => {
        fs.readdir(this.uploadPath, function (err, files) {
            if (err) {
                throw new Error();
            }

            let fileInfos = [];

            files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: baseUrl + file,
                });
            });

            res.status(200).send(fileInfos);
        });
    }

    downloadFileByName = async (res, filename) => {
        return res.download(this.uploadPath + filename, filename, (err) => {
            if (err) {
                return res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
        })
    }

    uploadFile = async (res, data) => {
        if (data == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        try {
            // await pump(data.file, fs.createWriteStream(path.join(this.uploadPath, data.filename)))
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = FileService;
