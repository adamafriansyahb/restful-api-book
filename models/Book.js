const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    summary: {
        type: String,
        required: true
    }
}); 

module.exports = new mongoose.model('Book', bookSchema);