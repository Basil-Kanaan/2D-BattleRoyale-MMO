const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwtGenerator = require("../services/token");
const bodyParser = require("body-parser");
const { User } = require("../../models/user");
const { Bill } = require("../../models/bill");
const jwt = require("jsonwebtoken");
const authorize = require("../middleware/authorize");
const nodemailer = require("nodemailer");
var mongoose = require("mongoose");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "billtrackercompany@gmail.com",
    pass: "billtracker786",
  },
});
// user login
router.post("/api/user/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(404).send();
      } else {
        if (user.verified) {
          bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
              res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
              });
            } else {
              const jwtToken = jwtGenerator(user._id);
              res.json({ jwtToken: jwtToken });
            }
          });
        } else {
          res.status(401).send({
            accessToken: null,
            message: "Verify Your Account!",
          });
        }
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//get user info
router.post("/api/user/profile", authorize, (req, res) => {
  const id = new mongoose.Types.ObjectId(req.body.id);
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send();
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.put("/api/user/verify-password-reset", (req, res) => {
  const resetLink = req.header("jwt_token");
  if (resetLink) {
    try {
      jwt.verify(resetLink, "forgotpassword1234");
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          res.status(404).send();
        }
        res.status(200).send();
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send();
  }
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
router.post("/api/user/register", (req, res) => {
  const email = req.body.email;


  
  bcrypt.hash(req.body.password, 10, (err, hash) => {

    const token = jwt.sign({ email: req.body.email }, "verifyaccount1234", {
      expiresIn: "20m",
    });

    const new_user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      verified: false,
    });

    
    //new_user.verifiedLink = token;
  //   .update({email: req.body.email}, {
  //     verifiedLink: token
  //  }, function(err, affected, resp) {
  //     console.log(resp);
  //  })
    

    // Check if user already exists, if not, create new account
    User.findOne({ email })
      .then((user) => {
        if (user) {
          res.status(400).send();
        } else {
          //new_user.verifiedLink = token;
          new_user
            .save()
            .then((newuser) => {

             
              // const jwtToken = jwtGenerator(user._id);
              //
              // res.json({ jwtToken: jwtToken });

              // .update({_id: idd}, {
              //   info: "some new info",
              //   password: newPassword
              // }, function(err, affected, resp) {
              //   console.log(resp);
              // });
             
              const data = {
                from: "billtrackercompany@gmail.com",
                to: email,
                subject: "Account Verification",
                html: `<h2>Please click on the link to verify your account</h2>
                                       <a href=http://localhost:3000/#/verification/${token}>http://localhost:3000/verification/${token}</a>`,
              };

              // transporter.sendMail(data, (err, info) => {
              //   if (err) {
              //     res.status(500).json(err);
              //   }
              //   res.status(200).send();
              // });

            //   newuser.updateOne({email: req.body.email}, {
            //     verifiedLink: token
            // }, function(err, affected, resp) {
            //     console.log(resp);
            // });

            newuser.updateOne({ verifiedLink: token}, (err, success) => {
              if (err) {
                res.status(400).json(err);
              } else {
                transporter.sendMail(data, (err, info) => {
                  if (err) {
                    res.status(500).json(err);
                  }
                  res.status(200).send();
                });
              }
            });
             

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

// Get all bills for a user
router.post("/api/user/bill", (req, res) => {
  const email = req.body.email; //("email");

  Bill.find({ email })
    .then((bills) => {
      if (!bills) {
        res.status(404).send();
      } else {
        res.send(bills);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get all bills for a user sorted alphabetically by bill name
router.get("/api/user/billAlphabetic", (req, res) => {
  const email = req.body.email;

  Bill.find({ email })
    .sort({ name: 1 })
    .then((bills) => {
      if (!bills) {
        res.status(404).send();
      } else {
        res.send(bills);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get all bills for a user sorted numerically by lowest bill amount
router.get("/api/user/billLowest", (req, res) => {
  const email = req.body.email;

  Bill.find({ email })
    .sort({ billamt: 1 })
    .then((bills) => {
      if (!bills) {
        res.status(404).send();
      } else {
        res.send(bills);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Get all bills for a user sorted numerically by highest bill amount
router.get("/api/user/billHighest", (req, res) => {
  const email = req.body.email;

  Bill.find({ email })
    .sort({ billamt: -1 })
    .then((bills) => {
      if (!bills) {
        res.status(404).send();
      } else {
        res.send(bills);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Delete a user's account
router.delete("/api/user", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(404).send();
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (!result) {
            res.status(401).json("Invalid Password!");
          } else {
            User.findOneAndRemove({ email })
              .then((user) => {
                if (!user) {
                  res.status(404).send();
                } else {
                  res.send(user);
                }
              })
              .catch((error) => {
                res.status(500).send(error);
              });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update user information
router.patch("/api/user", (req, res) => {
  const email = req.body.original_email;

  const new_user_info = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  User.findOneAndUpdate({ email }, { $set: new_user_info }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send();
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update user password
router.patch("/api/user/password", (req, res) => {
  const email = req.body.email;
  const currPass = req.body.currentpassword;
  const password = req.body.password;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(404).send();
      } else {
        bcrypt.compare(currPass, user.password, (err, result) => {
          if (!result) {
            res.status(401).json("Invalid password");
          } else {
            bcrypt.hash(password, 10, (err, hash) => {
              const new_user_info = {
                password: hash,
              };
              User.findOneAndUpdate(
                { email },
                { $set: new_user_info },
                { new: true }
              )
                .then((user) => {
                  if (!user) {
                    res.status(404).send();
                  } else {
                    res.json(true);
                  }
                })
                .catch((error) => {
                  res.status(500).send(error);
                });
            });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});


router.put("/api/account-verification", (req, res) => {
  const verifyLink = req.header("jwt_token");

  if (verifyLink) {
    try {
      jwt.verify(verifyLink, "verifyaccount1234");

        const new_user_info = {
          verified: true,
          verifiedLink: "",
        };

        User.findOneAndUpdate(
            { verifiedLink: verifyLink },
            { $set: new_user_info },
            { new: true }
        )
            .then((user) => {
              if (!user) {
                res.status(404).send();
              } else {
                res.json(true);
              }
            })
            .catch((error) => {
              res.status(500).send(error);
            });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Error2");
  }
});

router.put("/api/reset-password", (req, res) => {
  const resetLink = req.header("jwt_token");
  const password = req.body.password;
  if (resetLink) {
    try {
      jwt.verify(resetLink, "forgotpassword1234");

      bcrypt.hash(password, 10, (err, hash) => {
        const new_user_info = {
          password: hash,
          resetLink: "",
        };
        User.findOneAndUpdate(
          { resetLink },
          { $set: new_user_info },
          { new: true }
        )
          .then((user) => {
            if (!user) {
              res.status(404).send();
            } else {
              res.json(true);
            }
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send("Error2");
  }
});

router.put("/api/forgot-password", (req, res) => {
  const email = req.body.email;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      res.status(400);
    }
    const token = jwt.sign({ _id: user._id }, "forgotpassword1234", {
      expiresIn: "20m",
    });
    const data = {
      from: "billtrackercompany@gmail.com",
      to: email,
      subject: "Forgot password",
      html: `<h2>Please click on the link to reset your password</h2>
                    <a href=http://localhost:3000/#/resetpassword/${token}>http://localhost:3000/resetpassword/${token}</a>`,
    };

    user.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        res.status(400).json(err);
      } else {
        transporter.sendMail(data, (err, info) => {
          if (err) {
            res.status(500).json(err);
          }
          res.status(200).send();
        });
      }
    });
  });
});

module.exports = router;
