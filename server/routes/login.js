var express = require('express');
var loginRouter = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userModels = require('../models/userModel');
var currentlyLoggedInUser;

var userModel = mongoose.model('users', userModels);

loginRouter.use(passport.initialize())
loginRouter.use(passport.session())

passport.serializeUser(function (user, done) {
    done(null, user._id);
})


passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
})

passport.use(
    new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
        await userModel.findOne({ email: email })
            .then(user => {
                if (password === user.password) {
                    return done(null, user)
                } else { // correct password, goes back to authenticate method below 
                    return done(null, false, 
                        {
                            message: 'incorrectPassword'
                        }
                    )
                }
            }) // incorrect password, does not go back to authenticate method below
            .catch(err => {
                return done(null, false, 
                    { 
                        message: err 
                    }
                );
            })
    }))

loginRouter.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) { // uses the LocalStrategy method above to authenticate users when logging in
        console.log(user)
        console.log(info)

        req.login(user, ((err, next) => { // attempts to log in user
            if (err) {
                return res.json(-1)
            } else { // if success returns -1 as a value, so that it can be checked in the frontend 
                currentlyLoggedInUser = user

                let tempUserVar = user._id;
                res.status(200).send(tempUserVar)}
        }))
    })(req, res, next);
});


loginRouter.get('/extractSessionId', (req, res, next) => {;
    console.log(`CURRENT USER: ${currentlyLoggedInUser}`)
    res.send(currentlyLoggedInUser)
})

loginRouter.put('/resetSession', (req, res, next) => {
    currentlyLoggedInUser = null
    console.log('Reset session')
})

module.exports = loginRouter;