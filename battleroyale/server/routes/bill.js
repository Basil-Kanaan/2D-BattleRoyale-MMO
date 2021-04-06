const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const {ObjectID} = require('mongodb');
const {User} = require('../../models/user');
const {Bill} = require('../../models/bill');

// Get a bill by using its ID
router.get('/api/bill', (req, res) => {

    const _id = req.body._id;

    // Validate id
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
        return;
    }

    Bill.findById({_id})
        .then(bill => {
            if (!bill) {
                res.status(404).send();
            } else {
                res.send(bill);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Create a new bill
router.post('/api/bill', (req, res) => {
    const email = req.body.email;

    const bill = new Bill({
        email: req.body.email,
        name: req.body.name,
        billamt: req.body.billamt,
        category: req.body.category,
        type: req.body.type,
        date: req.body.date,
        day: req.body.day,
        month: req.body.month
    });

    // If user exists, save the new bill to database
    User.findOne({email})
        .then(user => {
            if (!user) {
                res.status(400).send();
            } else {
                bill.save()
                    .then((bill) => {
                        res.send(bill);
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

// Delete a bill
router.delete('/api/bill', (req, res) => {
    const _id = req.body._id;

    // Validate id
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
        return;
    }

    Bill.findByIdAndRemove({_id})
        .then(bill => {
            if (!bill) {
                res.status(404).send();
            } else {
                res.send(bill);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Update bill information
router.patch('/api/bill', (req, res) => {
    const _id = req.body._id;

    // Validate id
    if (!ObjectID.isValid(_id)) {
        res.status(400).send();
        return;
    }

    const new_bill_info = {
        billamt: req.body.billamt,
        day: req.body.day,
        date: req.body.date,
        month: req.body.month,
        type: req.body.type,
    };

    Bill.findByIdAndUpdate({_id}, {$set: new_bill_info}, {new: true})
        .then(bill => {
            if (!bill) {
                res.status(404).send();
            } else {
                res.send(bill);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

router.get('/api/bill/count', (req, res) => {

    Bill.count()
        .then(count => {
            res.json(count);
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Update email of bills (can use this for updating email of bills after user changes their email)
router.patch('/api/bill/updateEmail', (req, res) => {
    const oldEmail = req.body.oldEmail;
    const newEmail = req.body.newEmail;


    const new_bill_info = {
        email: newEmail
    };

    Bill.updateMany({email: oldEmail}, new_bill_info, {upsert: false})
        .then(bills => {
            if (!bills) {
                res.status(404).send();
            } else {
                res.send(bills);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Get a bills by category
// If both category and email specified, then the route will find all bills for a given user and category
// If only the category is specified, route will find all bills for a given category
router.get('/api/bill/category', (req, res) => {

    var query = {};
    if ("email" in req.body) {
        query = {
            email: req.body.email,
            category: req.body.category
        };
    }
    else {
        query = {
            category: req.body.category
        };
    }

    Bill.find(query)
    .then(bills => {
            if (!bills) {
                res.status(404).send();
            } else {
                res.send(bills);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

module.exports = router;
