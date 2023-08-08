import Pair from './Pair.js';
import Ammo from './Ammo.js';
import Bullet from './Bullet.js';

function randint(n) {
    return Math.round(Math.random() * n);
}

function rand(n) {
    return Math.random() * n;
}

// creates a bullet or ammo based on guntype 
export default class AmmunitionFactory {
    setWorld(world) {
        this.world = world;
    }

    getBullet(position, velocity, type, shooter) {
        var radius;
        var colour;
        var damage;

        switch (type) {
            case "pistol":
                radius = 4;
                colour = 'rgba(123,57,0,1)';
                damage = 10;
                break;

            case "railgun":
                radius = 6;
                colour = 'rgba(123,57,0,1)';
                damage = 20;
                break;

            case "cannon":
                radius = 15;
                colour = 'rgba(123,57,0,1)';
                damage = 100;
                velocity.mult(0.8);
                break;
        }

        return new Bullet(position, velocity, colour, radius, damage, type, shooter);
    }

    getAmmo(type) {

        var position = new Pair(randint(this.world.width), randint(this.world.height));
        var radius;
        var colour;
        var amount;
        var num_balls;

        switch (type) {
            case "pistol":
                radius = 4;
                colour = "rgba(192,192,192,1)";
                amount = 10;
                num_balls = 5;
                break;

            case "railgun":
                radius = 6;
                colour = 'rgba(207, 148, 0,1)';
                amount = 3;
                num_balls = 3;
                break;

            case "cannon":
                radius = 15;
                colour = 'rgba(255, 0, 0,1)';
                amount = 1;
                num_balls = 1;
                break;
        }

        return new Ammo(position, colour, radius, amount, num_balls, type);
    }


}