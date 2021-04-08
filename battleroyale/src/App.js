import React, {useContext, useEffect} from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
// components
import Layout from "./components/Layout";
import Landing from './pages/Landing';
import Register from './pages/Register';

import {makeStyles} from "@material-ui/core";
import {AuthContext} from './contexts/AuthContext';
import CollisionHandler from "./model/CollisionHandler";
import AmmunitionFactory from "./model/AmmunitionFactory";
import AiFactory from "./model/AiFactory";
import World from "./model/World";


const webSocketPort = 3001;

// Web Sockets
var WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({port: webSocketPort});

// init important game variables and credentials
let world = null;
let interval = null;
let difficulty = "medium";
// let credentials = {"username": "", "password": ""};

const speed = 22;

let canvasRef = null;


// setup new world and game objects
function setupGame() {
    const collisionHandler = new CollisionHandler(difficulty);
    const ammunitionFactory = new AmmunitionFactory();
    const aiFactory = new AiFactory();

    world = new World(collisionHandler, ammunitionFactory, aiFactory, difficulty);
    collisionHandler.setWorld(world);
}

// add game interval loop
function startGame() {
    interval = setInterval(function () {
        if (!world) {
            return;
        }
        world.step();
    }, 100);
}

// clear world interval
function pauseGame() {
    clearInterval(interval);
    interval = null;
}

// when the game ends, reset world, controls, and event listeners
function endGame() {

    // clears interval
    pauseGame();

    if (!world) return;

    // remove intervals for all Ai
    for (let i = 0; i < world.actors.length; i++) {
        const actor = world.actors[i];
        if (actor.constructor.name === "Ai") {
            clearInterval(actor.interval);
            actor.interval = null;
        }
    }

    world.actors = [];
    world.camera.actors = [];
    world.camera.draw();

    // remove event listeners
    document.removeEventListener('keydown', keyDownListener, true);
    document.removeEventListener('keyup', stopKey, false);
    document.removeEventListener('mousemove', aimListener, false);
    document.removeEventListener('mousedown', clickListener, false);

    document.getElementById("gameContent").removeEventListener('resize', resizeCanvas, false);

    // remove world and controls
    world = null;
}

let messages=[];

console.log("HELLO REACHED HERE");

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

export default function App() {
    // global
    const {isAuth, updateAuth, updateToken, token} = useContext(AuthContext);

    const checkAuthenticated = () => {
        fetch('http://localhost:8000/api/user/verify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            data === true ? updateAuth(true) : updateAuth(false);
        }).catch(err => {
            console.log("Error");
        });
    };

    useEffect(() => {
        //checkAuthenticated();
    }, []);

    setupGame();
    startGame();

    return (
        <div className="App">
            <Switch>
                <Route path="/" render={() => !isAuth ? (<Landing/>) : (<Redirect to="/app"/>)} exact/>
                <Route path="/login" render={() => <Login/>} exact/>
                <Route path="/app" component={Layout}/>
                <Route path="/register" render={() => !isAuth ? (<Register/>) : (<Redirect to="/app"/>)}/>

                <Route path='*'>
                    <div>Not Found</div>
                </Route>
            </Switch>
        </div>
    );
}
