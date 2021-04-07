import Ball from './Ball.js';
import Pair from './Pair.js';

// bullet class 
export default class Bullet extends Ball {
    constructor(position, velocity, colour, radius, damage, type) {
        super(position, velocity, colour, radius);

        this.damage = damage;
        this.type = type;
    }
}