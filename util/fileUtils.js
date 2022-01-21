const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

const UPLOAD_PATH = path.join(path.resolve(), 'uploads');

const writeFile = async (file, filename) => {
    try {
        await pump(file, fs.createWriteStream(path.join(UPLOAD_PATH, filename)))
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    writeFile
}