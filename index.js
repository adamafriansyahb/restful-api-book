if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const booksRoute = require('./routes/books');
const authorsRoute = require('./routes/authors');
const publishersRoute = require('./routes/publishers');

const app = express();

app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
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

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});