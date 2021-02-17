const mongoose = require('mongoose');
const Book = require('./Book'); 

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    residence: {
        type: String,
        required: true
    }
});

authorSchema.pre('remove', function(next) {
    Book.find({author: this.id}, (err, books) => {
        if (err) {
            next(err);
        }
        else if (books.length > 0) {
            next(new Error(`Couldn't delete this author, since this author still has book.`));
        }
        else {
            next();
        }
    });
});

module.exports = mongoose.model('Author', authorSchema);