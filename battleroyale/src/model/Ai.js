import Ball from './Ball.js';
import Pair from './Pair.js';

// Ai class
export default class Ai extends Ball {
    constructor(position, velocity, colour, radius, health, weapon, type) {
        super(position, velocity, colour, radius);

        this.health = health;
        this.turret_position = new Pair(0, 0);
        this.ammo = 1000;
        this.condition = "normal";
        this.weapon = weapon;
        this.type = type;
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
    }

    drawTurret(context, camera) {

        var player = camera.world.player;
        var rect = {x: this.x - camera.x, y: this.y - camera.y, width: this.radius * 2, height: this.radius / 20 * 15};

        var angle = Math.atan2((player.y - camera.y) - rect.y, (player.x - camera.x) - rect.x) * 180 / Math.PI + 180;

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
        this.modified_velocity = this.velocity.copy();

        switch (this.condition) {
            case "fast":
                this.modified_velocity.mult(1.2);
                break;
            case "slowed":
                this.modified_velocity.mult(0.8);
                break;
        }

        switch (this.type) {
            case "spray":
                this.modified_velocity.mult(1.3);
                break;
            case "boss":
                this.modified_velocity.mult(0.9);
                break;
        }

        this.position.x += this.modified_velocity.x;
        this.position.y += this.modified_velocity.y;
        this.intPosition();
    }
}