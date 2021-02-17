const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

router.get('/', async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', getAuthor, (req, res) => {
    res.json(res.author);
});

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name,
        residence: req.body.residence
    });

    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.patch('/:id', getAuthor, async (req, res) => {
    if (req.body.name != null) {
        res.author.name = req.body.name;
    }
    if (req.body.residence != null) {
        res.author.residence = req.body.residence;
    }

    try {
        const updatedAuthor = await res.author.save();
        res.json(updatedAuthor);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', getAuthor, async (req, res) => {
    try {
        await res.author.remove();
        res.json({message: "Author deleted."});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getAuthor(req, res, next) {
    let author;
    try {
        author = await Author.findById(req.params.id);
        if (author == null) {
            return res.status(404).json({message: `Couldn't find the author.`});
        }
    }
    catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.author = author;
    next();
}

module.exports = router;