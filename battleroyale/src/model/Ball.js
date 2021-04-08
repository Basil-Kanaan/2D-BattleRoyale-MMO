// general ball class
export default class Ball {
    constructor(position, velocity, colour, radius) {

        this.position = position;
        this.intPosition(); // this.x, this.y are int version of this.position

        this.velocity = velocity;
        this.colour = colour;
        this.radius = radius;
    }

    headTo(position) {
        this.velocity.x = (position.x - this.position.x);
        this.velocity.y = (position.y - this.position.y);
        this.velocity.normalize();
    }

    toString() {
        return this.position.toString() + " " + this.velocity.toString();
    }

    step() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.intPosition();
    }

    intPosition() {
        this.x = Math.round(this.position.x);
        this.y = Math.round(this.position.y);
    }

    draw(context, camera) {
        context.fillStyle = this.colour;
        // context.fillRect(this.x, this.y, this.radius,this.radius);
        context.beginPath();
        context.arc(this.x - camera.x, this.y - camera.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
    }
}