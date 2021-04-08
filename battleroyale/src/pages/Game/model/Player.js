import Ball from './Ball.js';
import Pair from './Pair.js';

// holds all necessary information of player
export default class Player extends Ball {
    constructor(position, velocity, colour, radius, health) {
        super(position, velocity, colour, radius);

        this.health = health;
        this.turret_position = new Pair(0, 0);
        this.ammo = {"pistol": 10, "railgun": 5, "cannon": 1};
        this.score = 0;

        this.weapon = "pistol";
        this.condition = "normal";
    }

    // switch to next weapon if space pressed
    nextWeapon() {
        if (this.weapon == "pistol") {
            this.weapon = "railgun";
        } else if (this.weapon == "railgun") {
            this.weapon = "cannon";
        } else if (this.weapon == "cannon") {
            this.weapon = "pistol";
        } else {
            this.weapon = "pistol";
        }
    }

    draw(context, camera) {

        context.fillStyle = this.colour;

        this.drawTurret(context, camera);

        // draw circle
        context.beginPath();
        context.arc(this.x - camera.x, this.y - camera.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        context.closePath();

        var healthToRGB = [200, 200];
        if (this.health > 50) {
            healthToRGB[0] *= 1 - ((this.health - 50) / 50);
        } else {
            healthToRGB[1] *= this.health / 50;
        }

        // display health
        context.save();
        context.font = "20px Verdana";
        context.fillStyle = `rgb(${healthToRGB.join()},0)`;

        var txt = `${this.health}`;
        var measure = context.measureText(txt);
        var txtWidth = ~~(measure.width);
        context.fillText(txt, (this.x - camera.x) - txtWidth / 2, (this.y - camera.y) + 5);
        context.restore();
    }

    drawTurret(context, camera) {

        var rect = {x: this.x - camera.x, y: this.y - camera.y, width: this.radius * 2, height: 15};

        var canvasMouse = camera.getMousePos(camera.world.mouse);
        var angle = Math.atan2(canvasMouse.y - rect.y, canvasMouse.x - rect.x) * 180 / Math.PI + 180;

        context.save();
        context.translate(rect.x, rect.y);
        context.rotate(angle * Math.PI / 180);
        context.fillStyle = this.colour;
        context.fillRect(-rect.width, rect.height / -2, rect.width, rect.height);
        context.strokeRect(-rect.width, rect.height / -2, rect.width, rect.height);
        context.restore();

        // cos x = (x cord)/h
        // sin x = (y cord)/h
        this.turret_position = new Pair(this.x + -2 * this.radius * Math.cos(angle * Math.PI / 180), this.y + -2 * this.radius * Math.sin(angle * Math.PI / 180));
    }

    step() {
        // depending on terrain, change velocity
        this.modified_velocity = this.velocity.copy();

        switch (this.condition) {
            case "fast":
                this.modified_velocity.mult(1.2);
                break;
            case "slowed":
                this.modified_velocity.mult(0.8);
                break;
        }

        this.position.x += this.modified_velocity.x;
        this.position.y += this.modified_velocity.y;
        this.intPosition();
    }
}