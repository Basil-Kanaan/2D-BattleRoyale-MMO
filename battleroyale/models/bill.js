'use strict';

const {model, Schema} = require('mongoose');
const {isAlphanumeric, isDate, isEmail} = require('validator');

const BillSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: isEmail,
      message: 'Not valid email'
     }
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  billamt: {
    type: Number,
    required: true,
    trim: true
  },
  // description: {
  //   type: String,
  //   required: true,
  //   trim: true
  // },
  type: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    type: String,
    //required: true,
    trim: true
  },
  month: {
    type: String,
   // required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
});

const Bill = model('Bill', BillSchema);

module.exports = {
    Bill
};
