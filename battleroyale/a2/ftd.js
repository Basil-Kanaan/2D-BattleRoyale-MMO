// https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/
// https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1
// https://www.sohamkamani.com/blog/2018/05/30/understanding-how-expressjs-works/

var port = 8000;
var express = require('express');
var app = express();

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
			error = res.status(403).json({ error: 'Error while checking dup user!' });
		}
		else if (pgRes.rows.length >= 1) {
			error = res.status(403).json({ error: 'Username has already been taken!' });
		}
		else {
			error = "none";
		}
	});
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

		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
		pool.query(sql, [username, password], (err, pgRes) => {
			if (err) {
				return console.error('Error executing query', err.stack)
				//res.status(403).json({ error: 'Not authorized' });
			} else if (pgRes.rowCount == 1) {
				next();
			} else {
				return res.status(403).json({ error: 'Not authorized' });
			}
		});
	} catch (err) {
		return res.status(403).json({ error: 'Not authorized' });
	}
});

// All routes below /api/auth require credentials 
app.post('/api/auth/login', function (req, res) {
	res.status(200);
	res.json({ "message": "authentication success" });
});

// Registration post route
app.post('/api/register', function (req, res, next) {
	var username = req.body.username;
	var confirm = req.body.confirm;
	var password = req.body.password;
	var birthday = req.body.birthday;
	var skill = req.body.skill;
	var day = req.body.day;
	var difficulty = "Easy";
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
			console.log(day);
			return res.status(403).json({ error: 'Days selected length Invalid!' });
		}
		if (birthday.length > 10 || birthday.length == 0) {
			return res.status(403).json({ error: 'Birthday length is Invalid!' });
		}

		const dupsql = 'SELECT * FROM ftduser WHERE username=$1';
		pool.query(dupsql, [username], (err, pgRes) => {
			if (err) {
				return console.error('Error executing query', err.stack)

			} else if (pgRes.rowCount == 0) {
				const regsql = 'INSERT INTO ftduser VALUES($1,sha512($2),$3,$4,$5)';
				const values = [username, password, birthday, skill, day];
		
				pool.query(regsql, values)
					.then(pgRes => {
						const gamesql = 'INSERT INTO GameParams VALUES($1,$2)';
						const gamevals = [username, difficulty];
						pool
							.query(gamesql, gamevals)
							.then(pgRes => {
								next();
								return res.status(200).json({ "message": "registration success" });
							}).catch(e => console.log(e.stack));
					}).catch(e => console.log(e.stack));
			} else {
				return res.status(409).json({ error: 'Duplicate username' });
			}
		});
		
	} catch (error) {
		console.log(error.stack)
		return res.status(403).json({ error: 'Registration Failed!' });
	}
});


// do authorized change profile
app.put('/api/auth/profile', function (req, res, next) {
	var username = req.body.username;
	var confirm = req.body.confirm;
	var password = req.body.password;
	var birthday = req.body.birthday;
	var skill = req.body.skill;
	var day = req.body.day;

	//make sure info has been past in
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

		const regsql = 'UPDATE ftduser SET password=sha512($2), birthday=$3, skill=$4, day=$5 WHERE username=$1';
		const values = [username, password, birthday, skill, day];
		pool.query(regsql, values)
		.catch(e => console.log(e.stack))
		
		res.status(200).json({ "message": 'profile update success' });

	} catch (error) {
		console.log(error.stack)
		return res.status(403).json({ error: 'Update Failed!' });
	}
});


// do authorized delete profile
app.delete('/api/auth/profile', function (req, res, next) {
	var username = req.body.username;
	//Do error checking
	try {
		const values = [username];
		const regsql = 'DELETE FROM Scores WHERE username=$1';
		pool
			.query(regsql, values)
			.then(res => {
				const gamesql = 'DELETE FROM GameParams WHERE username=$1';
				pool
					.query(gamesql, values)
					.then(res => {
						const usersql = 'DELETE FROM ftduser WHERE username=$1';
						pool
							.query(usersql, values)
							.then(res => {
								next();
							}).catch(e => console.log(e.stack))

					}).catch(e => console.log(e.stack))
			}).catch(e => console.log(e.stack))

			return res.status(200).json({ "message": 'profile delete success' });

	} catch (error) {
		console.log(error.stack)
		return res.status(403).json({ error: 'Deleted Failed!' });
	}
});


// do authorized save score
app.post('/api/auth/score', function (req, res, next) {
	
	var username = req.body.username;
	var score = req.body.score;
	var difficulty = req.body.difficulty;
	
	
	const sql = 'INSERT INTO Scores VALUES($1,$2,$3)';
	const values = [username, score, difficulty];

	pool.query(sql, values)
	.then(pgRes => {
		return res.status(200).json({ "message": "add score success" });			
	}).catch(e => {
		return res.status(500).json({ error: "fail add score"});
	});	 
});


// do authorized get high scores
app.post('/api/auth/highscore', function (req, res, next) {
	
	var username = req.body.username;

	const sql = 'SELECT Max(score), difficulty FROM Scores WHERE username=$1 GROUP BY username, difficulty ORDER BY difficulty;';
	const values = [username];

	pool.query(sql, values)
	.then(pgRes => {
	
		var resdata = {
			"easy": 0,
			"medium": 0,
			"hard": 0 
		};

		for (var i = 0; i < pgRes.rowCount; i ++){
			var row = pgRes.rows[i];
			resdata[row.difficulty] = row.max;
		}

		return res.status(200).json(resdata);			
	}).catch(e => {
		console.log(e.stack);
		return res.status(500).json({ error: "fail get highscores"});
	});	 
});

// do authorized get leaderboard
app.post('/api/auth/leaderboard', function (req, res, next) {
	
	const sql = "(SELECT username, score, difficulty FROM Scores WHERE difficulty='easy' ORDER BY score DESC LIMIT 10)\
	UNION ALL\
	(SELECT username, score, difficulty FROM Scores WHERE difficulty='medium' ORDER BY score DESC LIMIT 10)\
	UNION ALL\
	(SELECT username, score, difficulty FROM Scores WHERE difficulty='hard' ORDER BY score DESC LIMIT 10);";

	pool.query(sql)
	.then(pgRes => {
	
		var resdata = {
			"easy": [],
			"medium": [],
			"hard": [] 
		};

		for (var key in resdata){
			for (var i = 0; i < 10; i++){
				resdata[key].push(["", 0]);
			}
		}

		var easyCount = 0;
		var mediumCount = 0;
		var hardCount = 0;
		for (var i = 0; i < pgRes.rowCount; i ++){
			var row = pgRes.rows[i];

			switch(row.difficulty){
				case "easy":
					resdata[row.difficulty][easyCount++] = [row.username, row.score];
					break;
				case "medium":
					resdata[row.difficulty][mediumCount++] = [row.username, row.score];
					break;
				case "hard":
					resdata[row.difficulty][hardCount++] = [row.username, row.score];
					break;
			}
		}

		return res.status(200).json(resdata);			
	}).catch(e => {
		console.log(e.stack);
		return res.status(500).json({ error: "fail to get leaderboard"});
	});	 
});

app.post('/api/auth/test', function (req, res) {
	res.status(200);
	res.json({ "message": "got to /api/auth/test" });
});

app.use('/', express.static('static_content/model'));
app.use('/', express.static('static_content/view'));
app.use('/', express.static('static_content'));

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});
