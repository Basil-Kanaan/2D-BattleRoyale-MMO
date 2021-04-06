const {model, Schema} = require('mongoose');
var mongoose = require('mongoose');

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    }
});

const Company = model('Company', CompanySchema);

module.exports = {
    Company
};
