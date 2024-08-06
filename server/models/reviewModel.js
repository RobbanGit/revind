var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var reviewSchema = new Schema({
    title: {type: String},
    description: {type: String},
    rating: {type: Number},
    owner: {type: Schema.Types.ObjectId, ref: 'users' },
    product: {type: Schema.Types.ObjectId, ref: 'items'}
})

module.exports = reviewSchema;