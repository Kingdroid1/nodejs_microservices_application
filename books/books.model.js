const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    // Title, Author, NumberOfPages, Publisher
    title: String,
    author: String,
    numberOfPages: Number,
    publisher: String
},
    { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema)
module.exports = Book