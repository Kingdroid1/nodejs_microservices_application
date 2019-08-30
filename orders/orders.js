// spin up express server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5050;
const mongoose = require('mongoose');
const axios = require('axios');
const request = require('request');

// require orders model
const Order = require('./orders.model');

// DB connect
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://order:order123@ds131763.mlab.com:31763/orderservice")
    .then(() => {
        console.info('Order DB connected on mlab');
    }).catch((err) => {
        if (err) {
            console.log('Error', err)
        }
    })


// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// enable cors
app.use(cors());

// routes
app.get('/', (req, res, next) => {
    res.send('Halo there, this is orders service ... how may I help you?');
})

app.post('/order', (req, res) => {

    let newOrder = new Order();

    newOrder.customerID = mongoose.Types.ObjectId(req.body.customerID);
    newOrder.bookID = mongoose.Types.ObjectId(req.body.bookID);
    newOrder.orderDate = req.body.orderDate;
    newOrder.deliveryDate = req.body.deliveryDate;

    newOrder.save()
        .then((order) => {
            console.log('new order ...', order);
        }).catch((err) => {
            if (err) {
                throw err;
            }
        })
    res.status(200)
        .json({
            status: true,
            message: 'New order created successful'
        })

})

app.get('/orders', (req, res) => {
    Order.find({})
        .then((orders) => res.status(200)
            .json({
                status: true,
                message: orders
            })).catch(err => res.send(err));

})

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id)
        .then((order) => {
            if (order) {
                axios.get('http://localhost:4040/customer/' + order.customerID)
                    .then((response) => {
                        let orderItem = {
                            CustomerName: response.data.message.name,
                            BookTitle: ''
                        }
                        console.log('orderItem ...', orderItem.CustomerName);

                        axios.get('http://localhost:3030/book/' + order.bookID)
                            .then((response) => {
                                orderItem.BookTitle = response.data.message.title;
                                console.log('orderItem2 ...', orderItem.BookTitle);
                                res.status(200).json({
                                    status: true,
                                    message: orderItem
                                })
                            })
                    })

            } else {
                res.sendStatus(404);
            }
        }).catch(err => res.send(err));

})

// start server
app.listen(port, () => {
    console.log('hello, up and running Orders service on port', port);
})