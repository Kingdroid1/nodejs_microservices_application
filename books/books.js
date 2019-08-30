// spin up express server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3030;
const mongoose = require('mongoose');

// require Book model
const Book = require('./books.model');

// DB Connect
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://book:book123@ds259241.mlab.com:59241/bookservice")
    .then(() => {
        console.log('DB connected on mlab')
    })
    .catch(err => {
        if (err) {
            console.log('Error', err);
        }
    })

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// enable cors
app.use(cors());

// basic routes
app.get('/', (req, res) => {
    res.send('Hello, there!');
})

app.post('/book', (req, res) => {

    let newBook = new Book();
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.numberOfPages = req.body.numberOfPages;
    newBook.publisher = req.body.publisher;

    newBook.save().then((resBk) => {
        console.log('New book created!', resBk);
    }).catch((err) => {
        if (err) {
            throw err
        }
    })
    res.status(200)
        .json({
            status: true,
            message: 'book item saved successful'
        })
})

app.get('/books', (req, res) => {
    Book.find({})
        .then(books => res.status(200)
            .json({
                status: true,
                message: books
            })).catch(err => res.send(err));
})

app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                res.status(200).json({ status: true, message: book })
            } else { res.sendStatus(404); }
        })
        .catch(err => { if (err) { throw err } })
})

app.delete('/book/:id', (req, res) => {
    Book.findOneAndRemove(req.params.id)
        .then(book => {
            if (book) {
                res.status(200).json({ status: true, message: 'deleted book' })
            } else { res.sendStatus(404); }
        })
        .catch(err => { if (err) { throw err } })
})

app.put('/book/:id', (req, res) => {
    Book.findOneAndUpdate(req.params.id, req.body, { new: true })
        .then(book => {
            if (book) {
                res.status(200).json({ status: true, message: 'Updated book', book })
            } else { res.sendStatus(404); }
        })
        .catch(err => { if (err) { throw err } })
})
app.listen(port, () => {
    console.log('hi, up and running Books service on port', port);
})