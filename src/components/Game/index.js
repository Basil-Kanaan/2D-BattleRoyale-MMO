import React, {useEffect, useRef} from "react";
import CollisionHandler from './model/CollisionHandler.js';
import Pair from './model/Pair.js';
import World from './model/World.js';
import AmmunitionFactory from './model/AmmunitionFactory.js';
import AiFactory from './model/AiFactory.js';
// styles
import useStyles from "./styles";
import Button from "@material-ui/core/Button";
// components

// init important game variables and credentials
let world = null;
let interval = null;
let difficulty = "medium";
// let credentials = {"username": "", "password": ""};

const speed = 22;

let canvasRef = null;

// movement map and velocity
const moveMap = {
    'a': new Pair(-1, 0),
    's': new Pair(0, 1),
    'd': new Pair(1, 0),
    'w': new Pair(0, -1)
};

let controls = {
    'a': false,
    's': false,
    'd': false,
    'w': false
};


// setup new world and game objects
function setupGame(canvasRef) {
    const collisionHandler = new CollisionHandler(difficulty);
    const ammunitionFactory = new AmmunitionFactory();
    const aiFactory = new AiFactory();

    world = new World(collisionHandler, ammunitionFactory, aiFactory, difficulty, canvasRef.current);

    collisionHandler.setWorld(world);

    // add event listeners
    document.addEventListener('keydown', keyDownListener, true);
    document.addEventListener('keyup', stopKey, false);
    document.addEventListener('mousemove', aimListener, false);
    document.addEventListener('mousedown', clickListener, false);

    // resize the canvas to fill browser window dynamically
    document.getElementById("gameContent").addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
}

function resizeCanvas() {
    canvasRef.current.width = document.getElementById("gameContent").clientWidth - 100;
    canvasRef.current.height = window.innerHeight - 170;

    world.camera.width = canvasRef.current.width;
    world.camera.height = canvasRef.current.height;
}

// add game interval loop
function startGame() {
    interval = setInterval(function () {
        if (!world) {
            return;
        }
        world.step();
        world.camera.draw();
        if (world.end) {
            // saveScore();
            endGame();
        }
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
    controls = {
        'a': false,
        's': false,
        'd': false,
        'w': false
    };


}

// check buttons down for controls
function keyDownListener(event) {
    // switch to next weapon on spacebar
    if (event.key === " ") {
        if (world) world.player.nextWeapon();
    } else {
        // otherwise check move keys
        moveKey(event);
    }
}

// updates mouse pos in world
function aimListener(event) {
    if (world) world.updateMouse(event);
}

// shoot on click
function clickListener(event) {
    if (world) world.playerShoot(event);
}

// controls for movement
function stopKey(event) {
    controls[event.key] = false;
    updateVelocity();
}

// set control pressed to true
function moveKey(event) {
    if (event.key in controls) {
        controls[event.key] = true;
    }
    updateVelocity();
}

// changes velocity of player based on controls
function updateVelocity() {
    var velocity = new Pair(0, 0);
    if (controls['w'])
        velocity.add(moveMap['w']);
    if (controls['a'])
        velocity.add(moveMap['a']);
    if (controls['s'])
        velocity.add(moveMap['s']);
    if (controls['d'])
        velocity.add(moveMap['d']);

    if (world) world.player.velocity = velocity.normalize().mult(speed);
}


export default function Game(props) {
    var classes = useStyles();

    canvasRef = useRef(null);

    useEffect(() => {
        endGame();
        setupGame(canvasRef);
        startGame();
    }, []);

    return (
        <main className={classes.content} id={"gameContent"}>
            <canvas ref={canvasRef} width={614} height={614} id="stage" className={classes.gameView}/>
            <Button id="restart" className={classes.playAgain} onClick={() => {
                document.getElementById("restart").blur();
                endGame();
                setupGame(canvasRef);
                startGame();
            }}>Play Again</Button>
        </main>
    );
}
