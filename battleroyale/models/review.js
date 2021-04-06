const {model, Schema} = require('mongoose');
var mongoose = require('mongoose');
const {isEmail} = require('validator');

const ReviewSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: isEmail,
            message: 'Not valid email'
        }
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        trim: true
    }
});

const Review = model('Review', ReviewSchema);

module.exports = {
    Review
};
