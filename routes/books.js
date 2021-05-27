const express = require('express');
const router = express.Router();
const fs = require('fs');
const Book = require('../models/Book');

const verifyToken = require('../middleware/verifyToken');

const path = require('path');
const coverImagePath = 'uploads/bookCovers';
const uploadPath = path.join('public', coverImagePath);

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } 
        else {
            cb(null, false);
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('author').populate('publisher').exec();
        res.json(books); 
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/', [upload.single('coverImage'), verifyToken], async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        pageCount: req.body.pageCount,
        summary: req.body.summary,
        coverImage: req.file.path,
        publisher: req.body.publisher
    });
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }

});

router.get('/:id', getBook, (req, res) => {
    res.json(res.book);
});

router.patch('/:id', [getBook, verifyToken], async (req, res) => {
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

router.delete('/:id', [getBook, verifyToken], async (req, res) => {
    try {
        if (res.book.coverImage) {
            fs.unlink(res.book.coverImage, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }
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
        book = await Book.findById(req.params.id).populate('author').populate('publisher').exec();
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