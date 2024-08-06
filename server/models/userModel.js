const mongoose = require('mongoose')

let Schema = mongoose.Schema
let userSchema = new Schema({
    username: {type: String},
    email: {type: String},
    password :{type: String},
    userType: {type: String ,default:"User"},
    review: [{type: mongoose.Schema.Types.ObjectId}]
})

//module.exports = mongoose.model('users', userSchema)
module.exports = userSchema;