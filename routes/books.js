const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/book', async (req, res) => {
    try {
        const books = await Book.find().populate('author').exec();
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

router.get('/book/:id', getBook, (req, res) => {
    res.json(res.book);
});

router.patch('/book/:id', getBook, async (req, res) => {
    if (req.body.title != null) {
        res.book.title = req.body.title;
    }
    if (req.body.author != null) {
        res.book.author = req.body.author;
    }
    if (req.body.pageCount != null) {
        res.book.pageCount = req.body.pageCount;
    }
    if (req.body.summary != null) {
        res.book.summary = req.body.summary;
    }

    try {
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/book/:id', getBook, async (req, res) => {
    try {
        await res.book.remove();
        res.json({message: 'Book deleted.'});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getBook(req, res, next) {
    let book;
    try {
        book = await Book.findById(req.params.id);
        if (book == null) {
            return res.status(404).json({message: 'Cannot find the book.'});
        }
    }
    catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.book = book;
    next();
}

module.exports = router;