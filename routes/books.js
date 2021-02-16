const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/book', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books); 
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/book', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        pageCount: req.body.pageCount,
        summary: req.body.summary
    });
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }

});

module.exports = router;