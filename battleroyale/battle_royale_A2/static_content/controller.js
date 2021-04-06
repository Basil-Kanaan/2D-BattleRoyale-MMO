import Pair from './Pair.js';
import World from './model.js';
var world = null;
var view = null;
var interval = null;
var credentials = { "username": "", "password": "" };
var speed = 20;

var moveMap = {
        'a': new Pair(-speed, 0),
        's': new Pair(0, speed),
        'd': new Pair(speed, 0),
        'w': new Pair(0, -speed)
};

var controls = {
        'a': false,
        's': false,
        'd': false,
        'w': false
}


function setupGame() {
        world = new World();

        // https://javascript.info/keyboard-events
        document.addEventListener('keydown', moveKey, false);
        document.addEventListener('keyup', stopKey, false);
        document.addEventListener('mousemove', (event) => { world.updateMouse(event); });
        document.addEventListener('mousedown', (event) => { world.playerShoot(event); });
}

function startGame() {
        interval = setInterval(function () { world.step(); world.camera.draw(); }, 100);
}
function pauseGame() {
        clearInterval(interval);
        interval = null;
}

function stopKey(event) {
        controls[event.key] = false;
        updateVelocity();
}

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

        world.player.velocity = velocity;
}

function moveKey(event) {
        controls[event.key] = true;
        updateVelocity();
}
function loginView() {
        $("#ui_login").show();
        $("#ui_play").hide();
        $('#ui_register').hide();
}
function login() {
        $("#ui_login").show();
        $("#ui_play").hide();
        $('#ui_register').hide();

        credentials = {
                "username": $("#username").val(),
                "password": $("#password").val()
        };

        $.ajax({
                method: "POST",
                url: "/api/auth/login",
                data: JSON.stringify({}),
                headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                processData: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
        }).done(function (data, text_status, jqXHR) {
                console.log(jqXHR.status + " " + text_status + JSON.stringify(data));

                //play game
                playView();

                setupGame();
                startGame();

        }).fail(function (err) {
                console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
        });
}
//when ur done registering, go back to login page
function registerView() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $('#ui_register').hide();
        $('#ui_instructions').hide();
        $('#ui_stats').hide();
        $('#ui_profile').hide();
        $('#ui_register').show();
}
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

        if (document.getElementById('newuser').value == '' || document.getElementById('newuser').value.length < 3) {
                document.getElementById("errorMessage").innerHTML = 'Username is invalid!';
                return;
        }
        else if (document.getElementById('newpassword').value == '') {
                document.getElementById("errorMessage").innerHTML = 'Please enter a password!';
                return;
        }
        else if (document.getElementById('confirm').value == '') {
                document.getElementById("errorMessage").innerHTML = 'Please confirm your password!';
                return;
        }
        else if (document.getElementById('confirm').value != document.getElementById('newpassword').value) {
                document.getElementById("errorMessage").innerHTML = 'Your passwords do not match!';
                return;
        }
        else if (document.getElementById('confirm').value == '') {
                document.getElementById("errorMessage").innerHTML = 'Please confirm your password!';
                return;
        }
        else if (document.getElementById('birthday').value == '') {
                document.getElementById("errorMessage").innerHTML = 'Please enter your birthday!';
                return;
        }
        else if (checkedRadio == '') {
                document.getElementById("errorMessage").innerHTML = 'Please choose a skill level!';
                return;
        }
        else if (checkedBoxes.length == 0) {
                document.getElementById("errorMessage").innerHTML = 'Please check at least one box!';
                return;
        }
        else {
                document.getElementById("errorMessage").innerHTML = '';
        }
        credentials = {
                "username": $("#newuser").val(),
                "password": $("#newpassword").val(),
                "confirm": $("#confirm").val(),
                "birthday": $("#birthday").val(),
                "skill": checkedRadio,
                "day": checkedBoxes
        };

        $.ajax({
                method: "POST",
                url: "/api/authregis/registration",
                data: JSON.stringify(credentials),
                processData: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
        }).done(function (data, text_status, jqXHR) {
                console.log("GOING TO LOGIN!!");
                console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
                loginView();
        }).fail(function (err) {
                console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
        });


}

function playView() {
        $("#ui_login").hide();
        $("#ui_register").hide();
        $("#ui_instructions").hide();
        $("#ui_stats").hide();
        $("#ui_profile").hide();
        $("#ui_play").show();
        $('#navbar').show();
}
function instructionsView() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_instructions").show();
        $("#ui_stats").hide();
        $("#ui_profile").hide();
        console.log("hell from instuco");
}
function statsView() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_instructions").hide();
        $("#ui_stats").show();
        $("#ui_profile").hide();

        console.log("hellfrom stast");
}
function profileView() {
        $("#ui_login").hide();
        $("#ui_play").hide();
        $("#ui_register").hide();
        $("#ui_instructions").hide();
        $("#ui_stats").hide();
        $("#ui_profile").show();
        console.log("hello from prof");
}
function logout() {
        $("#ui_login").show();
        $("#ui_play").hide();
        $('#ui_register').hide();
        $('#ui_instructions').hide();
        $('#ui_stats').hide();
        $('#ui_profile').hide();
        $('#navbar').hide();
}

// Using the /api/auth/test route, must send authorization header
function test() {
        $.ajax({
                method: "GET",
                url: "/api/auth/test",
                data: {},
                headers: { "Authorization": "Basic " + btoa(credentials.username + ":" + credentials.password) },
                dataType: "json"
        }).done(function (data, text_status, jqXHR) {
                console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        }).fail(function (err) {
                console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
        });
}

$(function () {
        // // Setup all events here and display the appropriate UI
        $("#ui_login").show();
        $("#ui_play").hide();
        $('#ui_register').hide();
        $('#ui_instructions').hide();
        $('#ui_stats').hide();
        $('#ui_profile').hide();
        $('#navbar').hide();

        $("#loginSubmit").on('click', function () { login(); });
        $("#registerSubmit").on('click', function () { register(); });

        $("#switchToRegister").on('click', function () { registerView(); });
        $("#switchToLogin").on('click', function () { loginView(); });

        $("#switchToPlay").on('click', function () { playView(); });
        $("#switchToInstructions").on('click', function () { instructionsView(); });
        $("#switchToStats").on('click', function () { statsView(); });
        $("#switchToProfile").on('click', function () { profileView(); });
        $("#switchToLogout").on('click', function () { logout(); });

        setupGame();
        startGame();
});

