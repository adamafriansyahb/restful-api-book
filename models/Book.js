const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
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