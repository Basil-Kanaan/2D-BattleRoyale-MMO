import Ball from './Ball.js';
import Player from './Player.js';
import Ammo from './Ammo.js';
import Pair from './Pair.js';
import Bullet from './Bullet.js';
import Camera from './Camera.js';
import Ai from './Ai.js';
import Wall from './Wall.js';


function randint(n) { return Math.round(Math.random() * n); }
function rand(n) { return Math.random() * n; }

var playerHealth = 100;
var damage = 10;
var AiSpeed = 12;

export default class World {
	constructor(collisionHandler, ammunitionFactory, aiFactory) {

		// inject collision handler and factories
		this.collisionHandler = collisionHandler;
		this.ammunitionFactory = ammunitionFactory;
		this.aiFactory = aiFactory;

		this.ammunitionFactory.setWorld(this);
		this.aiFactory.setWorld(this);

		// init world size and mouse
		this.mouse = new Pair(0, 0);
		this.end = false;

		// the logical width and height of the world
		this.width = 5000;
		this.height = 5000;

		//game canvas 
		this.canvas = document.getElementById("stage");
		this.context = this.canvas.getContext("2d");

		// generate game objects and map
		this.actors = []; // all actors on this stage (monsters, player, boxes, ...)
		this.generateMap();
		this.generateAmmo(60, "pistol");
		this.generateAmmo(40, "railgun");
		this.generateAmmo(20, "cannon");
		this.generateAi(10, "normal");
		this.generateAi(2, "spray");
		this.generateAi(1, "boss");
		this.generateBoundaries();
		this.generateObstacles();

		// init player data
		var velocity = new Pair(0, 0);
		var radius = 20;
		var colour = 'rgba(77,153,79,1)';
		var position = new Pair(Math.floor(this.width / 2), Math.floor(this.height / 2));

		// create new player and add to world
		this.player = null;
		this.addPlayer(new Player(position, velocity, colour, radius, playerHealth));

		// create new camera
		this.camera = new Camera(document.getElementById('stage'), this.player, this);
	}

	updateMouse(event) {
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;
	}

	playerShoot(event) {
		if (this.player.ammo[this.player.weapon] > 0) {
			var playerRelativePos = new Pair(this.player.x - this.camera.x, this.player.y - this.camera.y);
			var mouseRelativePos = this.camera.getMousePos(this.mouse);

			var position = this.player.turret_position.copy();
			var velocity = mouseRelativePos.sub(playerRelativePos).normalize().mult(25);

			this.shootBullet(position, velocity, this.player.weapon);
			this.player.ammo[this.player.weapon]--;
		}
	}

	generateMap() {

		var context = document.createElement("canvas").getContext("2d");
		context.canvas.width = this.width;
		context.canvas.height = this.height;

		var cell = 34;
		var square = 33;

		var rows = Math.floor(this.width / cell);
		var columns = Math.floor(this.height / cell);

		var purple = `rgba(${[56, 8, 82].join()},1)`;
		var yellow = `rgba(${[219, 214, 46].join()},1)`;
		var green = `rgba(${[33, 171, 26].join()},1)`;
		var blue = `rgba(${[0, 204, 197].join()},1)`;

		context.save();
		for (var x = 0, i = 0; i < rows; x += cell, i++) {

			for (var y = 0, j = 0; j < columns; y += cell, j++) {

				if (j < columns / 2 && i < rows / 2) { context.fillStyle = purple; }
				else if (j < columns / 2 && i >= rows / 2) { context.fillStyle = green; }
				else if (j >= columns / 2 && i < rows / 2) { context.fillStyle = blue; }
				else { context.fillStyle = yellow };

				context.beginPath();
				context.rect(x, y, square, square);
				context.fill();
				context.closePath();
			}
		}
		context.restore();

		// store the generate map as this image texture
		this.map_bg = new Image();
		this.map_bg.src = context.canvas.toDataURL("image/png");

		context = null;

	}

	generateObstacles() {
		this.addActor(new Wall(new Pair(this.width / 2 + 100, this.height / 2 - 250), 'rgba(77,77,77,1)', 75, 75));
		this.addActor(new Wall(new Pair(this.width / 2 - 400, this.height / 2 + 50 ), 'rgba(77,77,77,1)', 70, 210));
		this.addActor(new Wall(new Pair(this.width / 2 + 223, this.height / 2 + 323), 'rgba(77,77,77,1)', 200, 200));

		this.addActor(new Wall(new Pair(400, 400), 'rgba(77,77,77,1)', 300, 70));
		this.addActor(new Wall(new Pair(400, 470), 'rgba(77,77,77,1)', 70, 230));


		this.addActor(new Wall(new Pair(1600, 1300), 'rgba(77,77,77,1)', 400, 100));
		this.addActor(new Wall(new Pair(1030, 1800), 'rgba(77,77,77,1)', 200, 500));

	}

	generateAmmo(n, type) {
		for (var i = 0; i < n; i++) {
			var ammo = this.ammunitionFactory.getAmmo(type);
			this.addActor(ammo);
		}
	}

	generateAi(n, type) {
		for (var i = 0; i < n; i++) {
			var x = randint(this.width - 2 * 50) + 50;
			var y = randint(this.height - 2 * 50) + 50;
			var position = new Pair(x, y);

			var ai = this.aiFactory.getAi(position, type);
			this.addActor(ai);
		}
	}

	generateBoundaries() {
		var leftWall = new Wall(new Pair(-this.width, -this.height), 'rgba(77,77,77,1)', this.width, 3 * this.height)
		var topWall = new Wall(new Pair(0, -this.height), 'rgba(77,77,77,1)', this.width, this.height)
		var rightWall = new Wall(new Pair(this.width, -this.height), 'rgba(77,77,77,1)', this.width, 3 * this.height)
		var bottomWall = new Wall(new Pair(0, this.height), 'rgba(77,77,77,1)', this.width, this.height)

		this.addActor(leftWall);
		this.addActor(topWall);
		this.addActor(rightWall);
		this.addActor(bottomWall);
	}

	addPlayer(player) {
		this.addActor(player);
		this.player = player;
	}

	removePlayer() {
		this.removeActor(this.player);
		this.player = null;
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	removeActor(actor) {
		var index = this.actors.indexOf(actor);
		if (index != -1) {
			this.actors.splice(index, 1);
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step() {
		// create frame of reference
		this.camera.x = this.player.x - this.camera.width / 2;
		this.camera.y = this.player.y - this.camera.height / 2;

		for (var i = 0; i < this.actors.length; i++) {

			var actor1 = this.actors[i];
			var className = actor1.constructor.name;

			if (className == "Ai" || className == "Player") {
				if (actor1.position.y > this.height / 2) {
					if (actor1.position.x <= this.width / 2) {
						actor1.condition = "fast";
					} else {
						actor1.condition = "slowed";
					}
				} else {
					if (actor1.position.x <= this.width / 2) {
						actor1.condition = "hurt";
					} else {
						actor1.condition = "normal";
					}
				}
			}

			if (className == "Ai") {
				var AiToPlayerVector = this.player.position.copy().sub(actor1.position);
				var x = AiToPlayerVector.x;
				var y = AiToPlayerVector.y;

				if (x * x + y * y >= 300 * 300) {
					var normalized = AiToPlayerVector.normalize().mult(AiSpeed);
					actor1.velocity = normalized;
					clearInterval(actor1.interval);
					actor1.interval = null;

				} else {
					actor1.velocity = new Pair(0, 0);
					if (actor1.interval == null) {

						actor1.interval = setInterval((world, actor, player) => {
							var position = actor.turret_position.copy()
							var velocity = player.position.copy().sub(actor.position).normalize().mult(25);

							world.shootBullet(position, velocity, actor.weapon);
						}, 1000, this, actor1, this.player);
					}
				}
			}
			actor1.step();

			if (className == "Ai" || className == "Player" || className == "Bullet") {
				for (var j = 0; j < this.actors.length; j++) {

					var actor2 = this.actors[j];
					var className2 = actor2.constructor.name;

					if (className == "Bullet" && (className2 == "Bullet" || className2 == "Ammo") || i == j) {
						continue;
					}

					this.collisionHandler.handle(actor1, actor2);
				}
			}
		}
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y) {
		for (var i = 0; i < this.actors.length; i++) {
			if (this.actors[i].x == x && this.actors[i].y == y) {
				return this.actors[i];
			}
		}
		return null;
	}

	shootBullet(position, velocity, type) {

		if (type == "railgun") {
			var bullet = this.ammunitionFactory.getBullet(position, velocity, type);
			this.addActor(bullet);

			setTimeout((world, bullet) => {
				world.addActor(bullet);
			}, 100, this, this.ammunitionFactory.getBullet(position, velocity, type));

			setTimeout((world, bullet) => {
				world.addActor(bullet);
			}, 200, this, this.ammunitionFactory.getBullet(position, velocity, type));

		} else {
			var bullet = this.ammunitionFactory.getBullet(position, velocity, type);
			this.addActor(bullet);
		}
	}
}
