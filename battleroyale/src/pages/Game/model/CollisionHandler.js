// Collision handler class for all collision calculations
// also takes care of score multiplier and being "more hurt" based on terrain
export default class CollisionHandler {
    constructor(difficulty) {

        // depending on difficulty, increase score multiplier
        switch (difficulty) {
            case "easy":
                this.scoremult = 1;
                break;
            case "medium":
                this.scoremult = 2;
                break;
            case "hard":
                this.scoremult = 4;
                break;
        }

        this.isCollision = {

            // Ball to Ball collision checker function
            "ballball": (obj1, obj2) => {
                var dx = obj1.x - obj2.x;
                var dy = obj1.y - obj2.y;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < obj1.radius + obj2.radius) {
                    return true;
                }
                return false;
            },

            // Ball to Wall collision checker function
            "ballwall": (obj1, obj2) => {

                var circle = obj1;
                var rect = obj2;

                var dx = Math.abs(circle.x - (rect.x + rect.width / 2));
                var dy = Math.abs(circle.y - (rect.y + rect.height / 2));

                if (dx > (rect.width / 2 + circle.radius)) {
                    return false;
                }

                if (dy > (rect.height / 2 + circle.radius)) {
                    return false;
                }

                if (dx <= (rect.width / 2)) {
                    return true;
                }
                if (dy <= (rect.height / 2)) {
                    return true;
                }

                dx -= rect.width / 2;
                dy -= rect.height / 2;
                return (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(circle.radius, 2));
            },
        }
    }

    // injection setter function
    setWorld(world) {
        this.world = world;
    }

    // collision handler, uses helper functions
    handle(obj1, obj2) {
        if (obj1 == null || obj2 == null) return;

        switch (obj1.constructor.name) {

            case "Player":
                this.handlePlayer(obj1, obj2);
                break;

            case "Bullet":
                this.handleBullet(obj1, obj2);
                break;

            case "Ai":
                this.handleAi(obj1, obj2);
                break;
        }
    }

    // player to ai/wall/ammo handler
    handlePlayer(player, obj2) {
        switch (obj2.constructor.name) {

            case "Ai":
                if (this.isCollision["ballball"](player, obj2)) {
                    player.position.sub(player.modified_velocity);
                    player.x = player.position.x;
                    player.y = player.position.y;
                }
                break;

            case "Wall":
                if (this.isCollision["ballwall"](player, obj2)) {
                    player.position.sub(player.modified_velocity);
                    player.x = player.position.x;
                    player.y = player.position.y;
                }
                break;

            case "Ammo":

                if (this.isCollision["ballball"](player, obj2)) {
                    player.ammo[obj2.type] += obj2.amount;
                    this.world.removeActor(obj2);
                    this.world.generateAmmo(1, obj2.type);
                }
                break;
        }
    }

    // bullet to wall/player/ai handler
    handleBullet(bullet, obj2) {
        var className2 = obj2.constructor.name;
        switch (className2) {
            case "Wall":
                if (this.isCollision["ballwall"](bullet, obj2)) {
                    this.world.removeActor(bullet);
                    obj2.health -= bullet.damage;
                    if (obj2.health <= 0) {
                        this.world.removeActor(obj2);
                        bullet.shooter.score += obj2.points;
                    }
                }
                break;

            case "Player":
            case "Ai":

                if (this.isCollision["ballball"](bullet, obj2)) {
                    if (obj2.condition == "hurt") {
                        obj2.health -= bullet.damage;
                    }

                    obj2.health -= bullet.damage;
                    this.world.removeActor(bullet);

                    if (obj2.health <= 0) {
                        if (className2 == "Ai") {
                            this.world.removeActor(obj2);
                            clearInterval(obj2.interval);
                            obj2.interval = null;
                            this.world.generateAi(1, obj2.type);
                            bullet.shooter.score += 1000 * this.scoremult;
                        } else {
                            this.world.end = true;
                        }
                    }
                }
                break;
        }
    }

    // ai to ai/wall handler
    handleAi(ai, obj2) {
        switch (obj2.constructor.name) {

            case "Ai":
                if (this.isCollision["ballball"](ai, obj2)) {
                    ai.position.sub(ai.modified_velocity);
                    ai.x = ai.position.x;
                    ai.y = ai.position.y;
                }
                break;

            case "Wall":
                if (this.isCollision["ballwall"](ai, obj2)) {
                    ai.position.sub(ai.modified_velocity);
                    ai.x = ai.position.x;
                    ai.y = ai.position.y;
                }
                break;
        }
    }
}