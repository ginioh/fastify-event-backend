const mongoose = require("mongoose");
const { slugify } = require("../util/functions");

const Promoter = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String
    },
    description: {
        type: String
    },
    website: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    }
})

Promoter.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

Promoter.post('findByIdAndUpdate', async function () {
    const docToUpdate = await this.model.findOne(this.getQuery());
    docToUpdate.slug = slugify(docToUpdate.name);
    docToUpdate.save();
});

module.exports = Promoter;