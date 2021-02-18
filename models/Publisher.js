const mongoose = require('mongoose');
const Book = require('./Book');

const publisherSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    email: {
        type: String
    }
});

publisherSchema.pre('remove', function(next) {
    Book.find({publisher: this.id}, (err, books) => {
        if (err) {
            next(err);
        }
        else if (books.length > 0) {
            next(new Error(`Couldn't delete publisher since it still has book.`));
        }
        else {
            next();
        }
    });
});

module.exports = mongoose.model('Publisher', publisherSchema);