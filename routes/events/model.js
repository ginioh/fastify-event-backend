"use strict";

const mongoose = require("mongoose");
const { ValidationException } = require("../../common/exceptions/db/ValidationException")
const { slugify } = require("../../util/functions");

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
        required: true,
        validate: [(value) => Date(this.startDate) <= Date(value)]
    },
    duration: {
        type: Number,
    },
    maxAttendance: {
        type: Number,
        default: 0
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
    invited: {
        type: [
            {
                email: {
                    type: String
                },
                sent: {
                    type: Boolean,
                    default: false
                }
            }
        ],
    },
    promoter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'promoter',
        validateExistance: true
    },
    locationName: {
        type: String,
        required: true
    },
    locationLatitude: {
        type: Number
    },
    locationLongitude: {
        type: Number
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    }
})

Event.pre('save', function (next) {
    this.slug = slugify(this.title);
    this.startDate = new Date(this.startDate);
    this.endDate = new Date(this.endDate);
    // this.featuredImage = process.env.AWS_BASE_URL + this.featuredImage;
    this.duration = this.endDate.getTime() - this.startDate.getTime()
    if (this.duration < 1) throw new ValidationException("End date should be after start date.");
    next();
});

// Event.pre('findByIdAndUpdate', function (next) {

// })

Event.post('findByIdAndUpdate', async function () {
    const docToUpdate = await this.model.findOne(this.getQuery());
    docToUpdate.slug = slugify(docToUpdate.title);
    docToUpdate.startDate = new Date(docToUpdate.startDate);
    docToUpdate.endDate = new Date(docToUpdate.endDate);
    docToUpdate.duration = docToUpdate.endDate.getTime() - docToUpdate.startDate.getTime()
    if (docToUpdate.duration < 1) throw new ValidationException("End date should be after start date.");
    // this.featuredImage = process.env.AWS_BASE_URL + this.featuredImage;
    docToUpdate.save();
});

module.exports = Event;