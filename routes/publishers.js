const express = require('express');
const router = express.Router();
const Publisher = require('../models/Publisher');
const verifyToken = require('../middleware/verifyToken');

router.get('/', async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.json(publishers);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', getPublisher, async (req, res) => {
    res.json(res.publisher);
});

router.post('/', verifyToken, async (req, res) => {
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

router.patch('/:id', [verifyToken, getPublisher], async (req, res) => {
    if (req.body.name != null) {
        res.publisher.name = req.body.name;
    }
    if(req.body.address != null) {
        res.publisher.address = req.body.address;
    }
    if (req.body.email != null) {
        res.publisher.email = req.body.email;
    }

    try {
        const updatedPublisher = await res.publisher.save();
        res.json(updatedPublisher);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', [verifyToken, getPublisher], async (req, res) => {
    try {
        await res.publisher.remove();
        res.json({message: "Publisher deleted."});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getPublisher(req, res, next) {
    let publisher;

    try {
        publisher = await Publisher.findById(req.params.id);
        if (publisher == null) {
            return res.status(404).json({message: `Couldn't find the publisher.`});
        }
    }
    catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.publisher = publisher;
    next();
}

module.exports = router;