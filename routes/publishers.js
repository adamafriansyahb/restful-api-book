const express = require('express');
const router = express.Router();
const Publisher = require('../models/Publisher');

router.get('/', async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.json(publishers);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/', async (req, res) => {
    const publisher = new Publisher({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email
    });

    try {
        const newPublisher = await publisher.save();
        res.status(201).json(newPublisher);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
});

module.exports = router;