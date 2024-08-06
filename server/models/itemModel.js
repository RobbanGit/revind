var mongoose = require('mongoose')
let Schema = mongoose.Schema

let itemSchema = new Schema({
    title: {type: String},
    description: {type: String},
    price: {type: Number},
    location:{type: mongoose.Types.ObjectId,ref:"locations"}
})

module.exports=itemSchema;
// module.exports = mongoose.model('products', itemSchema)
