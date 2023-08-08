import CollisionHandler from './model/CollisionHandler.js';
import Pair from './model/Pair.js';
import World from './model/World.js';
import AmmunitionFactory from './model/AmmunitionFactory.js';
import AiFactory from './model/AiFactory.js';


// init important game variables and credentials
let world = null;
let interval = null;
let credentials = {"username": "", "password": ""};

const speed = 22;

// movement map and velocity
const moveMap = {
    'a': new Pair(-1, 0),
    's': new Pair(0, 1),
    'd': new Pair(1, 0),
    'w': new Pair(0, -1)
};

let controls = {
    'a': false,
    's': false,
    'd': false,
    'w': false
};


// setup new world and game objects
function setupGame() {
    var collisionHandler = new CollisionHandler(difficulty);
    var ammunitionFactory = new AmmunitionFactory();
    var aiFactory = new AiFactory();

    world = new World(collisionHandler, ammunitionFactory, aiFactory, difficulty);

    collisionHandler.setWorld(world);

    // add event listeners
    document.addEventListener('keydown', keyDownListener, true);
    document.addEventListener('keyup', stopKey, false);
    document.addEventListener('mousemove', aimListener);
    document.addEventListener('mousedown', clickListener);
}

// check buttons down for controls
function keyDownListener(event) {
    // switch to next weapon on spacebar
    if (event.key === " ") {
        if (world) world.player.nextWeapon();
    } else {
        // otherwise check move keys
        moveKey(event);
    }
}

// updates mouse pos in world
function aimListener(event) {
    if (world) world.updateMouse(event);
}

// shoot on click
function clickListener(event) {
    if (world) world.playerShoot(event);
}

// add game interval loop
function startGame() {
    interval = setInterval(function () {
        if (!world) {
            return;
        }
        world.step();
        world.camera.draw();
        if (world.end) {
            saveScore();
            endGame();
        }
    }, 100);
}

// save user score to database
function saveScore() {

    var reqdata = {
        "username": credentials.username,
        "score": world.player.score,
        "difficulty": difficulty
    };

    $.ajax({
        method: "POST",
        url: "/api/auth/score",
        data: JSON.stringify(reqdata),
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

// get users high scores for all difficulties
function getHighscores() {
    var reqdata = {
        "username": credentials.username,
    };

    $.ajax({
        method: "POST",
        url: "/api/auth/highscore",
        data: JSON.stringify(reqdata),
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        document.getElementById("easyStat").innerHTML = data.easy;
        document.getElementById("medStat").innerHTML = data.medium;
        document.getElementById("hardStat").innerHTML = data.hard;

    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

// get leaderboards of top 10 players for all difficulties
function getLeaderboard() {
    $.ajax({
        method: "POST",
        url: "/api/auth/leaderboard",
        data: JSON.stringify({}),
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));

        document.getElementById('easyList').innerHTML = '';
        document.getElementById('mediumList').innerHTML = '';
        document.getElementById('hardList').innerHTML = '';

        for (var key in data) {
            var scores = data[key];

            for (var i = 0; i < 10; i++) {
                var entry = '<li>' + scores[i][0] + " " + scores[i][1] + '</li>';
                switch (key) {
                    case "easy":
                        document.getElementById('easyList').innerHTML += entry;
                        break;
                    case "medium":
                        document.getElementById('mediumList').innerHTML += entry;
                        break;
                    case "hard":
                        document.getElementById('hardList').innerHTML += entry;
                        break;
                }
            }
        }


    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

// when the game ends, reset world, controls, and event listeners
function endGame() {

    // clears interval
    pauseGame();

    if (!world) return;

    // remove intervals for all Ai
    for (var i = 0; i < world.actors.length; i++) {
        var actor = world.actors[i];
        if (actor.constructor.name == "Ai") {
            clearInterval(actor.interval);
            actor.interval = null;
        }
    }

    world.actors = [];
    world.camera.actors = [];
    world.camera.draw();

    // remove event listeners
    $("body").off();

    // remove world and controls
    world = null;
    controls = {
        'a': false,
        's': false,
        'd': false,
        'w': false
    };


}

// clear world interval
function pauseGame() {
    clearInterval(interval);
    interval = null;
}

// controls for movement
function stopKey(event) {
    controls[event.key] = false;
    updateVelocity();
}

// changes velocity of player based on controls
function updateVelocity() {
    var velocity = new Pair(0, 0);
    if (controls['w'])
        velocity.add(moveMap['w']);
    if (controls['a'])
        velocity.add(moveMap['a']);
    if (controls['s'])
        velocity.add(moveMap['s']);
    if (controls['d'])
        velocity.add(moveMap['d']);

    if (world) world.player.velocity = velocity.normalize().mult(speed);
}

// set control pressed to true
function moveKey(event) {
    if (event.key in controls) {
        controls[event.key] = true;
    }
    updateVelocity();
}

// log user in and set credentials accordingly
function login() {

    credentials = {
        "username": $("#username").val(),
        "password": $("#password").val()
    };

    $.ajax({
        method: "POST",
        url: "/api/auth/login",
        data: JSON.stringify({}),
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        document.getElementById("loginMessage").innerHTML = '';
        document.getElementById("username").value = '';
        document.getElementById("password").value = '';

        //play game
        hideAllElements();
        showElement("play");
        showElement("navbar");
        setActiveTab("play");

        setupGame();
        startGame();

    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
        document.getElementById("loginMessage").innerHTML = 'Invalid Login';
    });
}

// validate and register user, put new info into database, go to login page
function register() {
    var boxes = document.getElementsByTagName('input');
    var checkedRadio = "";
    var checkedBoxes = [];
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].type == "radio") {
            if (boxes[i].checked)
                checkedRadio = boxes[i].value;
        }
        if (boxes[i].type == "checkbox") {
            if (boxes[i].checked)
                checkedBoxes.push(boxes[i].value);
        }
    }

    // registration validation
    if (document.getElementById('newuser').value == '' || document.getElementById('newuser').value.length < 3) {
        document.getElementById("errorMessage").innerHTML = 'Username is invalid!';
        return;
    } else if (document.getElementById('newpassword').value == '') {
        document.getElementById("errorMessage").innerHTML = 'Please enter a password!';
        return;
    } else if (document.getElementById('confirm').value == '') {
        document.getElementById("errorMessage").innerHTML = 'Please confirm your password!';
        return;
    } else if (document.getElementById('confirm').value != document.getElementById('newpassword').value) {
        document.getElementById("errorMessage").innerHTML = 'Your passwords do not match!';
        return;
    } else if (document.getElementById('confirm').value == '') {
        document.getElementById("errorMessage").innerHTML = 'Please confirm your password!';
        return;
    } else if (document.getElementById('birthday').value == '') {
        document.getElementById("errorMessage").innerHTML = 'Please enter your birthday!';
        return;
    } else if (checkedRadio == '') {
        document.getElementById("errorMessage").innerHTML = 'Please choose a skill level!';
        return;
    } else if (checkedBoxes.length == 0) {
        document.getElementById("errorMessage").innerHTML = 'Please check at least one box!';
        return;
    } else {
        document.getElementById("errorMessage").innerHTML = '';
    }

    var reqdata = {
        "username": $("#newuser").val(),
        "password": $("#newpassword").val(),
        "confirm": $("#confirm").val(),
        "birthday": $("#birthday").val(),
        "skill": checkedRadio,
        "day": checkedBoxes
    };

    $.ajax({
        method: "POST",
        url: "/api/register",
        data: JSON.stringify(reqdata),
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        credentials.username = reqdata.username;
        credentials.password = reqdata.password;
        hideAllElements();
        showElement("login");
        document.getElementById("newuser").innerHTML = '';
        document.getElementById("newpassword").innerHTML = '';
        document.getElementById("confirm").innerHTML = '';
        document.getElementById("birthday").innerHTML = '';
    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
        if (err.status == 409)
            document.getElementById("errorMessage").innerHTML = 'Username already taken!';
    });
}

// validate and update profile info
function changeProfile() {
    document.getElementById("successMessage").innerHTML = '';
    var boxes = document.getElementsByTagName('input');
    var checkedRadio = "";
    var checkedBoxes = [];
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].type == "radio") {
            if (boxes[i].checked)
                checkedRadio = boxes[i].value;
        }
        if (boxes[i].type == "checkbox") {
            if (boxes[i].checked)
                checkedBoxes.push(boxes[i].value);
        }
    }
    if (document.getElementById('profpassword').value == '') {
        document.getElementById("proferrorMessage").innerHTML = 'Please enter a password!';
        return;
    } else if (document.getElementById('profconfirm').value == '') {
        document.getElementById("proferrorMessage").innerHTML = 'Please confirm your password!';
        return;
    } else if (document.getElementById('profconfirm').value != document.getElementById('profpassword').value) {
        document.getElementById("proferrorMessage").innerHTML = 'Your passwords do not match!';
        return;
    } else if (document.getElementById('profconfirm').value == '') {
        document.getElementById("proferrorMessage").innerHTML = 'Please confirm your password!';
        return;
    } else if (document.getElementById('profbirthday').value == '') {
        document.getElementById("proferrorMessage").innerHTML = 'Please enter your birthday!';
        return;
    } else if (checkedRadio == '') {
        document.getElementById("proferrorMessage").innerHTML = 'Please choose a skill level!';
        return;
    } else if (checkedBoxes.length == 0) {
        document.getElementById("proferrorMessage").innerHTML = 'Please check at least one box!';
        return;
    } else {
        document.getElementById("proferrorMessage").innerHTML = '';
    }
    //need to get current username logged in
    var reqdata = {
        "username": credentials.username,
        "password": $("#profpassword").val(),
        "confirm": $("#profconfirm").val(),
        "birthday": $("#profbirthday").val(),
        "skill": checkedRadio,
        "day": checkedBoxes,
    };

    $.ajax({
        method: "PUT",
        url: "/api/auth/profile",
        data: JSON.stringify(reqdata),
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        credentials.password = reqdata.password;
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        document.getElementById("proferrorMessage").innerHTML = '';
        document.getElementById("successMessage").innerHTML = 'Account Updated Successfully!';

        hideAllElements();
        showElement("profile");
        showElement("navbar");

    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

// delete user from database
function deleteProfile() {
    //need to get current username logged in to delete

    $.ajax({
        method: "DELETE",
        url: "/api/auth/profile",
        data: JSON.stringify(credentials),
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        logout();
    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

// reset credentials and go to login page
function logout() {
    hideAllElements();
    showElement("login");
    credentials = {};
}

// Using the /api/auth/test route, must send authorization header
function test() {
    $.ajax({
        method: "GET",
        url: "/api/auth/test",
        data: {},
        headers: {"Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password)},
        dataType: "json"
    }).done(function (data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
    }).fail(function (err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

// show a page
function showElement(key) {
    elements[key].show();
}

// hide all page elements
function hideAllElements() {
    for (var key in elements)
        elements[key].hide();
}

// set active tab in navbar
function setActiveTab(tab) {
    for (var key in navElements)
        navElements[key].style.backgroundColor = "#4CAF50";

    navElements[tab].style.backgroundColor = "#1c6e01";
}

// set all error messages in forms to null
function resetMessages() {
    document.getElementById("successMessage").innerHTML = '';
    document.getElementById("proferrorMessage").innerHTML = '';
    document.getElementById("errorMessage").innerHTML = '';
    document.getElementById("loginMessage").innerHTML = '';
}

$(function () {
    // Setup all events here and display the appropriate UI
    hideAllElements();
    showElement("login");

    // form submit listeners
    // $("#loginSubmit").on('click', function () { login(); });
    // $("#registerSubmit").on('click', function () { register(); });
    // $("#profileSubmit").on('click', function () { changeProfile(); });
    // $("#deleteSubmit").on('click', function () { deleteProfile(); });

    // unauthed switch page buttons
    // $("#switchToRegister").on('click', function () { resetMessages(); hideAllElements(); showElement("register"); document.getElementById("errorMessage").innerHTML = ''; });
    // $("#switchToLogin").on('click', function () { resetMessages(); hideAllElements(); showElement("login"); });

    // authed switch page buttons
    // $("#switchToPlay").on('click', function () {  hideAllElements(); showElement("play"); showElement("navbar"); setActiveTab("play"); if (world && world.end){endGame(); setupGame();} startGame();});
    // $("#switchToInstructions").on('click', function () { hideAllElements(); showElement("instructions"); showElement("navbar"); setActiveTab("instructions"); pauseGame();});
    // $("#switchToStats").on('click', function () { hideAllElements(); showElement("stats"); showElement("navbar"); setActiveTab("stats"); pauseGame(); getHighscores(); getLeaderboard(); });
    // $("#switchToProfile").on('click', function () { resetMessages(); hideAllElements(); showElement("profile"); showElement("navbar"); setActiveTab("profile"); document.getElementById("profusername").innerHTML = credentials.username;  pauseGame();});
    // $("#switchToLogout").on('click', function () { resetMessages(); logout(); });

    // restart game button
    $("#restart").on('click', function () {
        $(this).blur();
        endGame();
        setupGame();
        startGame();
    });
});

