const express = require('express');
const mongoose = require('mongoose');
const booksRoute = require('./routes/books');
const authorsRoute = require('./routes/authors');

const app = express();

app.use(express.json());

const dbURI = "mongodb://127.0.0.1:27017/books";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});
db.once('open', () => {
  console.log("Connected to database");
});

app.use('/api', booksRoute);
app.use('/api', authorsRoute);

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});