import Ball from './Ball.js';
import Pair from './Pair.js';

function randint(n) {
    return Math.round(Math.random() * n);
}

// ammo that gives bullets to player
export default class Ammo extends Ball {
    constructor(position, colour, radius, amount, num_balls, type) {
        super(position, new Pair(0, 0), colour, radius);

        this.amount = amount;
        this.type = type;
        this.num_balls = num_balls;

        this.randballs = [];
        for (var i = 0; i < this.num_balls; i++) {
            var dx = randint(30) - 15;
            var dy = randint(30) - 15;
            this.randballs.push([dx, dy]);
        }
    }

    draw(context, camera) {
        context.fillStyle = this.colour;

        var x = this.x - camera.x;
        var y = this.y - camera.y;


        for (var i = 0; i < this.num_balls; i++) {

            context.beginPath();
            context.arc(x + this.randballs[i][0], y + this.randballs[i][1], this.radius, 0, 2 * Math.PI, false);
            context.stroke();
            context.fill();
            context.closePath();
        }
    }
}