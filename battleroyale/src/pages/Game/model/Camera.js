import Pair from './Pair.js';

// camera that pans around the world with player in it's center
// uses canvas
export default class Camera {
    constructor(canvas, player, world) {
        this.canvas = canvas;
        this.actors = world.actors;
        this.world = world;

        // the logical width and height of the stage
        this.width = canvas.width;
        // console.log(canvas.width, canvas.height);
        // console.log(canvas.clientWidth, canvas.clientHeight);
        this.height = canvas.height;

        // create frame of reference
        this.x = player.x - this.width / 2;
        this.y = player.y - this.height / 2;

        this.position = new Pair(this.x, this.y);
    }

    // check camera within world boundaries
    viewWithin() {
        return this.x >= 0
            && this.y >= 0
            && this.x + this.width <= this.world.width
            && this.y + this.height <= this.world.height;
    }

    draw() {
        // console.log(this.width, this.height);
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.width, this.height);

        var x = this.x, y = this.y;

        // if camera not in world boundaries, make it go back
        if (!this.viewWithin()) {
            if (x < 0) {
                this.x = 0;
            }
            if (y < 0) {
                this.y = 0;
            }
            if (x + this.width > this.world.width) {
                this.x = this.world.width - this.width;
                this.position.x = this.x;
            }
            if (y + this.height > this.world.height) {
                this.y = this.world.height - this.height;
                this.position.y = this.y;
            }
        }

        // draw map relative to camera
        context.drawImage(this.world.map_bg, 0, 0, this.world.map_bg.width, this.world.map_bg.height,
            -this.x, -this.y, this.world.map_bg.width, this.world.map_bg.height);

        for (var i = 0; i < this.actors.length; i++) {
            this.actors[i].draw(context, this);
        }

        var center = new Pair(this.width / 2, this.height / 2);

        // add score, ammo and potentially game over text to screen.
        var scoreTxt = "SCORE: " + this.world.player.score;
        var ammoTxt = "AMMO: " + this.world.player.ammo[this.world.player.weapon] + ` (${this.world.player.weapon})`;
        var gameOverTxt = "GAME OVER";

        var measure;
        var txtWidth;

        if (this.world.end) {

            // Create gradient
            var gradient = context.createRadialGradient(center.x, center.y, 200, center.x, center.y, 300);
            gradient.addColorStop("0", "gray");
            gradient.addColorStop("1.0", "black");

            context.fillStyle = gradient;
            context.rect(center.x - 300, center.y - 150, 600, 300);
            context.fill();

            context.beginPath();
            context.fillStyle = "white";
            context.rect(center.x - 280, center.y - 130, 560, 260);
            context.fill();
            context.stroke();
            context.closePath();

            context.save();
            context.font = "bold 60px Verdana";
            measure = context.measureText(gameOverTxt);
            txtWidth = ~~(measure.width);

            context.fillStyle = "black";
            context.fillText(gameOverTxt, center.x - txtWidth / 2, center.y);
            context.restore();

            context.save();
            context.font = "50px Verdana";
            measure = context.measureText(scoreTxt);
            txtWidth = ~~(measure.width);

            // Create gradient
            var gradient = context.createLinearGradient(center.x - txtWidth / 2, center.y, center.x + txtWidth / 2, center.y);
            gradient.addColorStop("0", " magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");

            // Fill with gradient
            context.fillStyle = gradient;
            context.fillText(scoreTxt, center.x - txtWidth / 2, center.y + 70);
            context.restore();
        } else {
            context.save();
            context.font = "30px Verdana";
            measure = context.measureText(scoreTxt);
            txtWidth = ~~(measure.width) + 15;

            // Create gradient
            var gradient = context.createLinearGradient(this.width - txtWidth, this.height - 15, this.width, this.height);
            gradient.addColorStop("0", " magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");

            // Fill with gradient
            context.fillStyle = gradient;
            context.fillText(scoreTxt, this.width - txtWidth, this.height - 15);

            context.fillStyle = "black";
            context.fillText(ammoTxt, 10, this.height - 15);
            context.restore();
        }
    }

    // get mouse pos relative to camera
    getMousePos(mouse) {
        var rect = this.canvas.getBoundingClientRect();
        return new Pair(mouse.x - rect.left, mouse.y - rect.top);
    }
}