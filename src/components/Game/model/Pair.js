// pair represents positions, velocities, etc
export default class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(pair) {
        this.x += pair.x;
        this.y += pair.y;
        return this;
    }

    sub(pair) {
        this.x -= pair.x;
        this.y -= pair.y;
        return this;
    }

    mult(num) {
        this.x *= num;
        this.y *= num;
        return this;
    }

    copy() {
        return new Pair(this.x, this.y);
    }

    toString() {
        return "(" + this.x + "," + this.y + ")";
    }

    normalize() {
        var magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        if (magnitude == 0) {
            return this;
        }
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
        return this;
    }
}