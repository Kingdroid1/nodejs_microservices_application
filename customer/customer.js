// spin up express server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4040;
const mongoose = require('mongoose');

// require customer model
const Customer = require('./customer.model');

// DB connect
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://xxxxxx/<yourDB_name>")
    .then(() => {
        console.info('Customer DB connected');
    }).catch((err) => {
        if (err) {
            console.log('Error', err)
        }
    })

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// enable cors
app.use(cors());

// routes
app.get('/', (req, res, next) => {
    res.send('you are here on customer home');
})

app.post('/customer', (req, res) => {

    let newCust = new Customer();

    newCust.name = req.body.name;
    newCust.age = req.body.age;
    newCust.address = req.body.address;

    newCust.save()
        .then((cust) => {
            console.info('New customer created success', cust);
        }).catch((err) => {
            if (err) {
                throw err
            }
        })
    res.status(200)
        .json({
            status: true,
            message: 'customer saved successful'
        })
})

app.get('/customers', (req, res) => {
    Customer.find({})
            .then(customers => res.status(200)
            .json({
                status: true,
                message: customers
            })).catch(err => res.send(err));
})

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id)
            .then(customer => {
                if (customer) {
                    res.status(200).json({ status: true, message: customer })
                } else { res.sendStatus(404); }
            })
            .catch(err => { if (err) { throw err } })
})

app.delete('/customer/:id', (req, res) => {
    Customer.findOneAndRemove(req.params.id)
        .then(customer => {
            if (customer) {
                res.status(200).json({ status: true, message: 'deleted customer' })
            } else { res.sendStatus(404); }
        })
        .catch(err => { if (err) { throw err } })
})

app.put('/customer/:id', (req, res) => {
    Customer.findOneAndUpdate(req.params.id, req.body, { new: true })
        .then(customer => {
            if (customer) {
                res.status(200).json({ status: true, message: 'updated customer', customer })
            } else { res.sendStatus(404); }
        })
        .catch(err => { if (err) { throw err } })
})


app.listen(port, () => {
    console.log('Server up and hiking on port', port);
})
