const express = require('express');
const router = express.Router();
const jwtGenerator = require("./services/token");
const authorize = require("./middleware/authorize");


// user login 
router.post('/api/user/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // User.findOne({ email })
    //     .then(user => {
    //         if (!user) {
    //             res.status(404).send();
    //         } else {
    //             bcrypt.compare(password, user.password, (err, result) => {
    //
    //                 if (!result) {
    //                     res.status(401).send({
    //                         accessToken: null,
    //                         message: "Invalid Password!"
    //                     });
    //                 } else {
    //                     const jwtToken = jwtGenerator(user._id);
    //                     res.json({ jwtToken: jwtToken });
    //                 }
    //             });
    //         }
    //     })
    //     .catch(error => {
    //         res.status(500).send(error);
    //     });

});

//get user info
router.post('/api/user/profile', authorize, (req, res) => {
    const id = new mongoose.Types.ObjectId(req.body.id);
    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                res.send(user);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});


router.post("/api/user/verify", authorize, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Register a new user
router.post('/api/user/register', (req, res) => {
    var username = req.body.username;
    var confirm = req.body.confirm;
    var password = req.body.password;
    var birthday = req.body.birthday;
    var skill = req.body.skill;
    var day = req.body.day;

    console.log("username: " + username);
    console.log("confirm: " + confirm);
    console.log("password: " + password);
    console.log("birthday: " + birthday);
    console.log("skill: " + skill);
    console.log("day: " + day);
    return;
    // const new_user = new User({
    //     username: req.body.username,
    //     confirm: req.body.confirm,
    //     password: req.body.password,
    //     birthday: req.body.birthday,
    //     skill: req.body.skill,
    //     day: req.body.day,

    // });
    // if (!username) {
    //     return res.status(403).json({ error: 'No username sent!' });
    // }
    // if (!password) {
    //     return res.status(403).json({ error: 'No password sent!' });
    // }
    // if (!confirm) {
    //     return res.status(403).json({ error: 'Please confirm your password!' });
    // }
    // if (!birthday) {
    //     return res.status(403).json({ error: 'No birthday sent!' });
    // }
    // if (!skill) {
    //     return res.status(403).json({ error: 'No skill sent!' });
    // }
    // if (!day) {
    //     return res.status(403).json({ error: 'No day sent!' });
    // }
    // //Do error checking
    // try {

    //     if (username.length < 3 || username.length > 20) {
    //         return res.status(403).json({ error: 'Username Invalid Length!' });
    //     }
    //     if (password.length < 5 || confirm.length < 5) {
    //         return res.status(403).json({ error: 'Password Invalid Length!' });
    //     }
    //     if (password != confirm) {
    //         return res.status(403).json({ error: 'Passwords do not match!' });
    //     }
    //     if (skill != "Beginner" && skill != "Intermediate" && skill != "Advanced") {
    //         return res.status(403).json({ error: 'Invalid Skill Sent!' });
    //     }
    //     //since days is a string, count max num of chars
    //     if (day.length <= 0 || day.length > 3) {
    //         console.log(day);
    //         return res.status(403).json({ error: 'Days selected length Invalid!' });
    //     }
    //     if (birthday.length > 10 || birthday.length == 0) {
    //         return res.status(403).json({ error: 'Birthday length is Invalid!' });
    //     }
    //     const dupsql = 'SELECT * FROM ftduser WHERE username=$1';
    //     pool.query(dupsql, [username], (err, pgRes) => {
    //         if (err) {
    //             return console.error('Error executing query', err.stack);

    //         } else if (pgRes.rowCount == 0) {
    //             const regsql = 'INSERT INTO ftduser VALUES($1,sha512($2),$3,$4,$5)';
    //             const values = [username, password, birthday, skill, day];

    //             pool.query(regsql, values)
    //                 .then(pgRes => {
    //                     const gamesql = 'INSERT INTO GameParams VALUES($1,$2)';
    //                     const gamevals = [username, difficulty];
    //                     pool
    //                         .query(gamesql, gamevals)
    //                         .then(pgRes => {
    //                             next();
    //                             return res.status(200).json({ "message": "registration success" });
    //                         }).catch(e => console.log(e.stack));
    //                 }).catch(e => console.log(e.stack));
    //         } else {
    //             return res.status(409).json({ error: 'Duplicate username' });
    //         }
    //     });

    // } catch (error) {
    //     console.log(error.stack)
    //     return res.status(403).json({ error: 'Registration Failed!' });
    // }

    // // Check if user already exists, if not, create new account
    // User.findOne({ usernmae })
    //     .then(user => {
    //         if (user) {
    //             res.status(400).send();
    //         } else {
    //             new_user.save()
    //                 .then((user) => {
    //                     const jwtToken = jwtGenerator(user._id);
    //                     res.json({ jwtToken: jwtToken });
    //                 })
    //                 .catch((error) => {
    //                     res.status(500).send(error);
    //                 });
    //         }
    //     })
    //     .catch((error) => {
    //         res.status(500).send(error);
    //     });

});

// Delete a user's account
router.delete('/api/user', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                bcrypt.compare(password, user.password, (err, result) => {

                    if (!result) {
                        res.status(401).json("Invalid Password!");
                    } else {
                        User.findOneAndRemove({email})
                            .then(user => {
                                if (!user) {
                                    res.status(404).send();
                                } else {
                                    res.send(user);
                                }
                            })
                            .catch(error => {
                                res.status(500).send(error);
                            });
                    }
                });
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

// Update user information
router.patch('/api/user', (req, res) => {
    const email = req.body.original_email;

    const new_user_info = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    User.findOneAndUpdate({email}, {$set: new_user_info}, {new: true})
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                res.send(user);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Update user password
router.patch('/api/user/password', (req, res) => {
    const email = req.body.email;
    const currPass = req.body.currentpassword
    const password = req.body.password
    User.findOne({email})
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                bcrypt.compare(currPass, user.password, (err, result) => {

                    if (!result) {
                        res.status(401).json("Invalid password")
                    } else {
                        bcrypt.hash(password, 10, (err, hash) => {
                            const new_user_info = {
                                password: hash,
                            };
                            User.findOneAndUpdate({email}, {$set: new_user_info}, {new: true})
                                .then(user => {
                                    if (!user) {
                                        res.status(404).send();
                                    } else {
                                        res.json(true);
                                    }
                                })
                                .catch(error => {
                                    res.status(500).send(error);
                                });
                        })
                    }
                });
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

module.exports = router;
