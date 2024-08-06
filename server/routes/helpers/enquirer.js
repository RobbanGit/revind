var mongoose = require('mongoose')
var userModels = require('../../models/userModel')
var userModel = mongoose.model('users', userModels)

function checkEmail(input){
    if (userModel.findOne({email: input})){
        return false
    } else {return true}
}

function checkUsername(input){
    if (userModel.findOne({username: input})){
        return false
    } else {return true}
}

function checkPassword(input){
    if (input.length < 8){
        return false
    } else {return true}
}