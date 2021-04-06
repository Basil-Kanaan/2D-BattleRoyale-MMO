// https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/
// https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1
// https://www.sohamkamani.com/blog/2018/05/30/understanding-how-expressjs-works/

var port = 8000;
var express = require('express');
var app = express();
var sha512 = require('js-sha512');
var crypto = require("crypto");
var bcrypt = require("bcrypt");

const { Pool } = require('pg')
const pool = new Pool({
	user: 'webdbuser',
	host: 'localhost',
	database: 'webdb',
	password: 'password',
	port: 5432
});

const bodyParser = require('body-parser'); // we used this middleware to parse POST bodies

function isObject(o) { return typeof o === 'object' && o !== null; }
function isNaturalNumber(value) { return /^\d+$/.test(value); }

function dupName(res, username) {
	var error = "none";
	let usersql = 'SELECT * FROM ftduser WHERE username=$1';
	pool.query(usersql, [username], (err, pgRes) => {
		if (err) {
			console.log("SHOULD NOT BE HERE1");
			error = res.status(403).json({ error: 'Error while checking dup user!' });
		}
		else if (pgRes.rows.length >= 1) {
			console.log("SHOULD NOT BE HERE2");
			error = res.status(403).json({ error: 'Username has already been taken!' });
		}
		else {
			error = "none";
		}
	});
	return error;
}
function createUser(res, username, password, birthday, skill, day) {
	//console.log("in create function ");
	var error;
	let regsql = 'INSERT INTO ftduser VALUES($1,$2,$3,$4,$5)';
	pool.query(regsql, [username, password, birthday, skill, day], (err) => {
		error = "none";
		if (err) {
			//console.log("SHOULD NOT BE HERE3");
			error = res.status(403).json({ error: 'Error while putting user into DB!' });
		} else {
			error = "success";
		}
	});
	//console.log("done create function, error should be successsss: " + error);
	return error;
}

function setScore(res, username, score) {
	var error = "none";
	let scoresql = 'INSERT INTO Scores VALUES($1,$2)';
	pool.query(scoresql, [username, score], (err) => {
		if (err) {
			console.log("SHOULD NOT BE HERE4");
			error = res.status(403).json({ error: 'Error while putting score into DB!' });
		} else {
			error = "success";
		}
	});
	return error;
}

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw()); // support raw bodies

// Non authenticated route. Can visit this without credentials
app.post('/api/test', function (req, res) {
	res.status(200);
	res.json({ "message": "got here" });
});

/** 
 * This is middleware to restrict access to subroutes of /api/auth/ 
 * To get past this middleware, all requests should be sent with appropriate
 * credentials. Now this is not secure, but this is a first step.
 *
 * Authorization: Basic YXJub2xkOnNwaWRlcm1hbg==
 * Authorization: Basic " + btoa("arnold:spiderman"); in javascript
**/
app.use('/api/auth', function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: 'No credentials sent!' });
	}
	try {
		// var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var m = /^Basic\s+(.*)$/.exec(req.headers.authorization);

		var user_pass = Buffer.from(m[1], 'base64').toString()
		m = /^(.*):(.*)$/.exec(user_pass); // probably should do better than this

		var username = m[1];
		var password = m[2];

		console.log(username + " " + password);

		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
		pool.query(sql, [username, password], (err, pgRes) => {
			if (err) {
				res.status(403).json({ error: 'Not authorized' });
			} else if (pgRes.rowCount == 1) {
				next();
			} else {
				res.status(403).json({ error: 'Not authorized' });
			}
		});
	} catch (err) {
		res.status(403).json({ error: 'Not authorized' });
	}
});

// All routes below /api/auth require credentials 
app.post('/api/auth/login', function (req, res) {
	res.status(200);
	res.json({ "message": "authentication success" });
});

//do authorization for register
app.use('/api/authregis', function (req, res, next) {
	var username = req.body.username;
	var confirm = req.body.confirm;
	var password = req.body.password;
	var birthday = req.body.birthday;
	var skill = req.body.skill;
	var day = req.body.day;
	var score = 0;
	//make sure info has been past in
	if (!username) {
		return res.status(403).json({ error: 'No username sent!' });
	}
	if (!password) {
		return res.status(403).json({ error: 'No password sent!' });
	}
	if (!confirm) {
		return res.status(403).json({ error: 'Please confirm your password!' });
	}
	if (!birthday) {
		return res.status(403).json({ error: 'No birthday sent!' });
	}
	if (!skill) {
		return res.status(403).json({ error: 'No skill sent!' });
	}
	if (!day) {
		return res.status(403).json({ error: 'No day sent!' });
	}

	//Do error checking
	try {
		// var dupnameErr = dupName(res, username);
		// if (dupnameErr != "none") {
		// 	return;
		// }
		if (username.length < 3 || username.length > 20) {
			return res.status(403).json({ error: 'Username Invalid Length!' });
		}
		if (password.length < 5 || confirm.length < 5) {
			return res.status(403).json({ error: 'Password Invalid Length!' });
		}
		if (password != confirm) {
			return res.status(403).json({ error: 'Passwords do not match!' });
		}
		if (skill != "Beginner" && skill != "Intermediate" && skill != "Advanced") {
			return res.status(403).json({ error: 'Invalid Skill Sent!' });
		}
		//since days is a string, count max num of chars
		if (day.length <= 0 || day.length > 3) {
			return res.status(403).json({ error: 'Days selected length Invalid!' });
		}
		if (birthday.length > 10 || birthday.length == 0) {
			return res.status(403).json({ error: 'Birthday length is Invalid!' });
		}
		if (score != 0) {
			return res.status(403).json({ error: 'Score is Invalid!' });
		}
		//console.log("about to create user!");
		//Now put user info in db
		//and check if it returned an error
		// var createUserErr = createUser(res, username, password, birthday, skill, day);
		// console.log(createUserErr);
		// if (createUserErr != "none" && createUserErr != "success") {
		// 	console.log("error in user db!!");
		// 	return;
		// }
		// else if (createUserErr == "success") {
		// 	console.log("created user!!");
		// 	next();
		// }
		const regsql = 'INSERT INTO ftduser VALUES($1,sha512($2),$3,$4,$5)';
		const values = [username, password, birthday, skill, day];
		pool
			.query(regsql, values)
			.then(res => {
			}).catch(e => console.log(e.stack))

		// var hashpass = crypto.createHash('sha512');
		// hashpass.update(password);
		// var hexHash = hashpass.digest('hex');
		// console.log()
		//console.log(typeof (res));
		//console.log(JSON.stringify(res.body));
		// try {
		// 	const res = await pool.query(regsql, values);
		// 	console.log(res.rows[0]);
		// } catch (err) {
		// 	console.log(err.stack);
		// }


		//Set scores table
		// var setScoreErr = setScore(res, username, score);
		// if (setScoreErr != "none" && setScoreErr != "success") {
		// 	console.log("error in score db!!");
		// 	return;
		// }
		// else if (setScoreErr == "success") {
		// 	next();
		// }

		//Set game params table
		// var setGameErr = setScore(res, username, score);
		// if (setGameErr != "none" && setScoreErr != "success") {
		// 	console.log("error in score db!!");
		// 	return;
		// }
		// else if (setScoreErr == "success") {
		// 	next();
		// }
	} catch (error) {
		console.log(error.stack)
		return res.status(403).json({ error: 'Registration Failed!' });
	}
});

//add post request for registration
app.post('/api/authregis/registration', function (req, res) {
	res.status(200);
	res.json({ "message": "authentication success" });
});


app.post('/api/auth/test', function (req, res) {
	res.status(200);
	res.json({ "message": "got to /api/auth/test" });
});

app.use('/', express.static('static_content'));

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

