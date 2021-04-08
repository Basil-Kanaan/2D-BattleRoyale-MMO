// External libraries import
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");

// Routes import
const user = require('./routes.js');

// Create main express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src'));
app.use(express.static(path.join(__dirname, '../src')));

app.use(cors());
app.use('/', user);

module.exports = app;