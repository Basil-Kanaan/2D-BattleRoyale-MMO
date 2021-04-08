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

var webSocketPort = 3001;

// Web Sockets
var WebSocketServer = require('ws').Server
    ,wss = new WebSocketServer({port: webSocketPort});

var messages=[];

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(message){
    for(let ws of this.clients){
        ws.send(message);
    }

    // Alternatively
    // this.clients.forEach(function (ws){ ws.send(message); });
};

wss.on('connection', function(ws) {
    var i;
    for(i=0;i<messages.length;i++){
        ws.send(messages[i]);
    }
    ws.on('message', function(message) {
        console.log(message);
        // ws.send(message);
        wss.broadcast(message);
        messages.push(message);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src'));
app.use(express.static(path.join(__dirname, '../src')));

app.use(cors());
app.use('/', user);

module.exports = app;

