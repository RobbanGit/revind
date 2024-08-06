const mongoose = require('mongoose')

let Schema = mongoose.Schema
let suggestionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'users'},
    username: {type: String},
    email: {type: String},
    subject: {type: String},
    feedback :{type: String}
})
module.exports = suggestionSchema;