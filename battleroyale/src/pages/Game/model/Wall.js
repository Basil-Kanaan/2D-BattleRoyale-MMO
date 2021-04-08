// wall rectangle obstacles
export default class Wall {
    constructor(position, colour, width, height) {

        this.health = Math.max(width, height) * 2;
        this.points = this.health * 2;

        this.position = position;
        this.colour = colour;
        this.width = width;
        this.height = height;

        this.x = position.x;
        this.y = position.y;
    }

    step() {

    }

    draw(context, camera) {
        var x = this.x - camera.x;
        var y = this.y - camera.y;

        var width = this.width;
        var height = this.height;

        context.save();
        context.beginPath();
        context.fillStyle = this.colour;
        context.rect(x, y, width, height);
        context.fill();
        context.closePath();
        context.restore();
    }
}