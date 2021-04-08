// import CollisionHandler from './model/CollisionHandler.js';
// import Pair from './model/Pair.js';
// import World from './model/World.js';
// import AmmunitionFactory from './model/AmmunitionFactory.js';
// import AiFactory from './model/AiFactory.js';
//
// // External libraries import
// const express = require('express');
// // const bodyParser = require('body-parser');
// const path = require('path');
// // const cors = require("cors");
//
// // Routes import
// const routes = require('../server/routes.js');
//
// // Create main express app
// const app = express();
//
// const webSocketPort = 3001;
//
// // Web Sockets
// const WebSocketServer = require('ws').Server;
// const wss = new WebSocketServer({port: webSocketPort});
//
//
// // init important game variables and credentials
// let world = null;
// let interval = null;
// let difficulty = "medium";
// // let credentials = {"username": "", "password": ""};
//
// const speed = 22;
//
// let canvasRef = null;
//
//
// // setup new world and game objects
// function setupGame(canvasRef) {
//     const collisionHandler = new CollisionHandler(difficulty);
//     const ammunitionFactory = new AmmunitionFactory();
//     const aiFactory = new AiFactory();
//
//     world = new World(collisionHandler, ammunitionFactory, aiFactory, difficulty, canvasRef.current);
//
//     collisionHandler.setWorld(world);
// }
//
// // add game interval loop
// function startGame() {
//     interval = setInterval(function () {
//         if (!world) {
//             return;
//         }
//         world.step();
//         world.camera.draw();
//         if (world.end) {
//             // saveScore();
//             endGame();
//         }
//     }, 100);
// }
//
// // clear world interval
// function pauseGame() {
//     clearInterval(interval);
//     interval = null;
// }
//
// // when the game ends, reset world, controls, and event listeners
// function endGame() {
//
//     // clears interval
//     pauseGame();
//
//     if (!world) return;
//
//     // remove intervals for all Ai
//     for (let i = 0; i < world.actors.length; i++) {
//         const actor = world.actors[i];
//         if (actor.constructor.name === "Ai") {
//             clearInterval(actor.interval);
//             actor.interval = null;
//         }
//     }
//
//     world.actors = [];
//     world.camera.actors = [];
//     world.camera.draw();
//
//     // remove event listeners
//     document.removeEventListener('keydown', keyDownListener, true);
//     document.removeEventListener('keyup', stopKey, false);
//     document.removeEventListener('mousemove', aimListener, false);
//     document.removeEventListener('mousedown', clickListener, false);
//
//     document.getElementById("gameContent").removeEventListener('resize', resizeCanvas, false);
//
//     // remove world and controls
//     world = null;
// }
//
// let messages=[];
//
// console.log("HELLO REACHED HERE");
//
// wss.on('close', function() {
//     console.log('disconnected');
// });
//
// wss.broadcast = function(message){
//     for(let ws of this.clients){
//         ws.send(message);
//     }
//
//     // Alternatively
//     // this.clients.forEach(function (ws){ ws.send(message); });
// };
//
// wss.on('connection', function(ws) {
//     let i;
//     for(i=0;i<messages.length;i++){
//         ws.send(messages[i]);
//     }
//     ws.on('message', function(message) {
//         console.log(message);
//         // ws.send(message);
//         wss.broadcast(message);
//         messages.push(message);
//     });
// });
//
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({extended: true}));
//
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../src'));
// app.use(express.static(path.join(__dirname, '../src')));
//
// // app.use(cors());
// app.use('/', routes);
//
// module.exports = app;
//
