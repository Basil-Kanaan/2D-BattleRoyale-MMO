// External libraries import
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");

// Routes import
const user = require('./routes/user.js');
const bill = require('./routes/bill.js');
const company = require('./routes/company.js');
const review = require('./routes/review.js');

// Create main express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src'));
app.use(express.static(path.join(__dirname, '../src')));
app.use(cors());
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://billtracker:billtracker786@billtracker.8kdk4.mongodb.net/BillTracker';

mongoose.connect(
    mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);

app.use(cors());
app.use('/', user);
app.use('/', bill);
app.use('/', company);
app.use('/', review);

module.exports = app;