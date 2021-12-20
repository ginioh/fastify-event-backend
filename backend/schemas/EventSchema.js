const mongoose = require("mongoose");
const { ValidationException } = require("../common/exceptions/db/ValidationException");
const { slugify } = require("../util/functions");

const Event = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String
    },
    featuredImage: {
        type: String,
        required: true
    },
    assets: {
        type: [String],
        required: true
    },
    tags: {
        type: [String]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category',
        validateExistance: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
    },
    url: {
        type: String,
        required: true,
    },
    isOffline: {
        type: Boolean,
        required: true,
        default: true
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: true
    },
    promoter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'promoter',
        validateExistance: true
    }
})

Event.pre('save', function (next) {
    this.slug = slugify(this.title);
    this.startDate = new Date(this.startDate);
    this.endDate = new Date(this.endDate);
    this.duration = this.endDate.getTime() - this.startDate.getTime()
    if (this.duration < 1) throw new ValidationException("End date should be after start date.");
    next();
});

Event.post('findByIdAndUpdate', async function () {
    const docToUpdate = await this.model.findOne(this.getQuery());
    docToUpdate.slug = slugify(docToUpdate.title);
    docToUpdate.startDate = new Date(docToUpdate.startDate);
    docToUpdate.endDate = new Date(docToUpdate.endDate);
    docToUpdate.duration = docToUpdate.endDate.getTime() - docToUpdate.startDate.getTime()
    if (docToUpdate.duration < 1) throw new ValidationException("End date should be after start date.");
    docToUpdate.save();
});

module.exports = Event;