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
    const email = req.body.original_email;

    bcrypt.hash(req.body.password, 10, (err, hash) => {

        const new_user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        });

        // Check if user already exists, if not, create new account
        User.findOne({ email })
            .then(user => {
                if (user) {
                    res.status(400).send();
                } else {
                    new_user.save()
                        .then((user) => {
                            const jwtToken = jwtGenerator(user._id);
                            res.json({ jwtToken: jwtToken });
                        })
                        .catch((error) => {
                            res.status(500).send(error);
                        });
                }
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    });
});

// Delete a user's account
router.delete('/api/user', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.status(404).send();
            } else {
                bcrypt.compare(password, user.password, (err, result) => {

                    if (!result) {
                        res.status(401).json("Invalid Password!");
                    } else {
                        User.findOneAndRemove({ email })
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

    User.findOneAndUpdate({ email }, { $set: new_user_info }, { new: true })
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
    User.findOne({ email })
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
                            User.findOneAndUpdate({ email }, { $set: new_user_info }, { new: true })
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
