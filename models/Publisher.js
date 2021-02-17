const mongoose = require('mongoose');

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

module.exports = mongoose.model('Publisher', publisherSchema);