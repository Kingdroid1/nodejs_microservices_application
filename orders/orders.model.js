// create model & schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerID: {type: mongoose.SchemaTypes.ObjectId, 
    required: true},

    bookID: {type: mongoose.SchemaTypes.ObjectId, 
    required: true},

    orderDate: {type:Date, 
    required: true},

    deliveryDate: {type:Date, 
        required: true}
},
{ timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order