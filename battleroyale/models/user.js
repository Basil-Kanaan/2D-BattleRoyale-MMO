const {model, Schema} = require('mongoose');
const {isAlphanumeric, isEmail} = require('validator');
var mongoose = require('mongoose');
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: isEmail,
            message: 'Not valid email'
        }
    },
    verified: {
        type: Boolean,
        required: true
    },
    verifiedLink:{
        data: String,
        default: ''
    },
    resetLink: {
        data: String,
        default: ''
    }
});

const User = model('User', UserSchema);

module.exports = {
    User
};
