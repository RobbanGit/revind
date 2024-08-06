var mongoose = require('mongoose')
let Schema = mongoose.Schema
let locationSchema = new Schema({
    name: {type: String},
    description: {type: String},
    country: {type: String},
    city: {type: String},
    street: {type: String},
    zipcode: {type: Number},
})
module.exports=locationSchema;