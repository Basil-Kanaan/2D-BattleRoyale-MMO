const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const {ObjectID} = require('mongodb');
const {Review} = require('../../models/review');

// Get all reviews for a company
router.post('/api/reviewsCompany', (req, res) => {

    const company = req.body.company;

    Review.find({company})
        .then(reviews => {
            if (!reviews) {
                res.status(404).send();
            } else {
                res.send(reviews);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Get all reviews for a user
router.get('/api/reviewsUser', (req, res) => {

    const email = req.body.email;

    Review.find({email})
        .then(reviews => {
            if (!reviews) {
                res.status(404).send();
            } else {
                res.send(reviews);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Create a new review
router.post('/api/review', (req, res) => {

    const review = new Review({
        email: req.body.email,
        company: req.body.company,
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating
    });

    review.save()
      .then((r) => {
        res.send(r);
       })
       .catch((error) => {
         res.status(500).send(error);
       });
});

// Delete a review
router.delete('/api/review', (req, res) => {
    const _id = req.body._id;

    // Validate id
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
        return;
    }

    Review.findByIdAndRemove({_id})
            .then(review => {
                if (!review) {
                    res.status(404).send();
                } else {
                    res.send(review);
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });

});

// Update a review
router.patch('/api/review', (req, res) => {

    const _id = req.body._id;

    // Validate id
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
        return;
    }

    const new_review_info = {
        email: req.body.email,
        company: req.body.company,
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating
    };

    Review.findOneAndUpdate({_id}, {$set: new_review_info}, {new: true})
        .then(r => {
            if (!r) {
                res.status(404).send();
            } else {
                res.send(r);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});
module.exports = router;
