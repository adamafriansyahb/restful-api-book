const express = require('express');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const booksRoute = require('./routes/books');
const authorsRoute = require('./routes/authors');
const publishersRoute = require('./routes/publishers');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const dbURI = "mongodb://127.0.0.1:27017/books";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});
db.once('open', () => {
  console.log("Connected to database");
});

app.use('/api/auth', authRoute);
app.use('/api/book', booksRoute);
app.use('/api/author', authorsRoute);
app.use('/api/publisher', publishersRoute)

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});