// create model & schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    type: mongoose.SchemaTypes.ObjectId,
    name: {type:String, 
    required: true},

    age: {type:Number, 
    required: true},

    address: {type:String, 
    required: true}
},
{ timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer