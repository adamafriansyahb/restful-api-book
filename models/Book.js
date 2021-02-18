const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher'
    }
}); 

module.exports = new mongoose.model('Book', bookSchema);