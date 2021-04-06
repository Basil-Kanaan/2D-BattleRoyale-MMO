const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const {ObjectID} = require('mongodb');
const {Company} = require('../../models/company');

// Get a company using company name
router.get('/api/company', (req, res) => {

    const name = req.body.name;

    Company.find({name})
        .then(company => {
            if (!company) {
                res.status(404).send();
            } else {
                res.send(company);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Create a new company
router.post('/api/company', (req, res) => {

    const company = new Company({
        name: req.body.name,
        category: req.body.category
    });

    company.save()
      .then((c) => {
        res.send(c);
       })
       .catch((error) => {
         res.status(500).send(error);
       });
});

// Delete a company
router.delete('/api/company', (req, res) => {
    const name = req.body.name;

    Company.findOneAndRemove({name})
        .then(c => {
            if (!c) {
                res.status(404).send();
            } else {
                res.send(c);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});

// Update company information
router.patch('/api/company', (req, res) => {
    const name = req.body.name;

    const new_company_info = {
        name: req.body.name,
        category: req.body.category
    };

    Company.findOneAndUpdate({name}, {$set: new_company_info}, {new: true})
        .then(c => {
            if (!c) {
                res.status(404).send();
            } else {
                res.send(c);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });

});
module.exports = router;
