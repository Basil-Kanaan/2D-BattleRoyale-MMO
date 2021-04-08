// External libraries import
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");

// Routes import
const routes = require('./routes.js');

// Create main express app
const app = express();

const webSocketPort = 3001;

// Web Sockets
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({port: webSocketPort});

let messages=[];

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
    let i;
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
app.use('/', routes);

module.exports = app;

