const mongoose = require("mongoose");
const { slugify } = require("../util/functions")

const Category = mongoose.Schema({
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
    icon: {
        type: String,
        required: true
    }
})

Category.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

Category.post('findByIdAndUpdate', async function () {
    const docToUpdate = await this.model.findOne(this.getQuery());
    docToUpdate.slug = slugify(docToUpdate.name);
    docToUpdate.save();
});

module.exports = Category;