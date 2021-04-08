import Pair from './Pair.js';
import Ai from './Ai.js';

// Ai factory creates an ai based on type with certain stats
export default class AiFactory {
    setWorld(world) {
        this.world = world;
    }

    getAi(position, type) {
        var radius;
        var colour;
        var health;
        var weapon;

        switch (type) {
            case "normal":
                radius = 20;
                colour = 'rgba(209,63,38,1)';
                health = 100;
                weapon = "pistol";
                break;

            case "spray":
                radius = 15;
                colour = 'rgba(50, 62, 168,1)';
                health = 30;
                weapon = "railgun";
                break;

            case "boss":
                radius = 40;
                colour = 'rgba(93, 19, 128,1)';
                health = 1000;
                weapon = "cannon";
                break;
        }

        return new Ai(position, new Pair(0, 0), colour, radius, health, weapon, type);
    }
}