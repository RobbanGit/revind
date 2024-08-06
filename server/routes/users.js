var express = require('express')
var userRouter = express.Router()
var bodyparser = require('body-parser')
var userModels = require('../models/userModel')
const itemModels = require("../models/itemModel");
var reviewModels = require("../models/reviewModel");
var suggestionModels = require('../models/suggestionModel');
const mongoose = require("mongoose");
var helper = require('./helpers/validator');
var enquire = require('./helpers/enquirer');

userRouter.use(bodyparser.json())
userRouter.use(bodyparser.urlencoded({ extended: false }))

var userModel = mongoose.model('users', userModels)
var reviewModel = mongoose.model('reviews', reviewModels)
var suggestionModel = mongoose.model('suggestions', suggestionModels)

userRouter.route('/').get((req, res, next) => {
    //currently prints all users, could limit it, but that also requires change to other code.
    //perhaps the 3,5,10 users who last reviewed/was active
    try {
        userModel.find((err, user) => {
            if (err) {
                return next(err)
            }
            res.status(200).json(
                {
                    "users": user
                }
            )
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when getting all users"
            }
        )
        console.log(e)
    }
})
userRouter.post('/', (req, res, next) => {
    // creates a user and saves it to the db
    try {
        var newUser = new userModel({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            userType: req.body.userType
        })

        console.log(`USERNAME: ${req.body.username}
        EMAIL: ${req.body.email}`)

        newUser.save(function (error, User) {
            if (error) {
                console.log(`[Post 'users/']Error Message: ${error.message}`)
            } else {
                res.status(201).send(newUser)
            }
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when creatign a users"
            }
        )
        console.log(e)
    }
})

userRouter.delete('/', (req, res, next) => {
    // deletes all users
    try {
        userModel.deleteMany((err, user) => {
            if (err) {
                next(err)
            }
            if (user["deletedCount" == null]) {
                res.json(
                    {
                        "message": "No users to delete"
                    }
                )
            }
            res.status(200).json(
                {
                    "message": "All users have been deleted"
                }
            )
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when deleting all users"
            }
        )
        console.log(e)
    }
})

userRouter.route('/:id').get((req, res, next) => {
    //specific userID
    try {
        let userId = req.params.id
        if (userId !== undefined) {
            var objId = mongoose.Types.ObjectId(userId);
            userModel.findOne({ _id: objId }, (err, user) => {
                if (err) {
                    next(err)
                }
                if (user == null) {
                    return res.status(404).json(
                        {
                            "message": "That user does not exist!"
                        }
                    )
                }
                res.status(200).json(user)
            })
        } else {
            res.status(403).json(
                {
                    "message": "No user specified"
                }
            )
        }
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when getting a specific user"
            }
        )
        console.log(e);
    }
}).put((req, res, next) => {
    try {
        console.log(req.params.id)
        const bodyUsername = req.body.username
        const bodyEmail = req.body.email
        const bodyPassword = req.body.password
        var objId = mongoose.Types.ObjectId(req.params.id);
        userModel.findOne({ _id: objId }, (err, user) => {
            if (err) {
                next(err)
            }
            if (user == null) {
                res.status(404).json(
                    {
                        "message": "That user does not exist!"
                    }
                )
            }

            user.username = bodyUsername;
            user.email = bodyEmail;
            user.password = bodyPassword;

            user.save();
            res.status(200).json(user);

        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when updating (PUT) a specific user"
            }
        )
        console.log(e);
    }
}).patch((req, res, next) => {
    try {
        var objId = mongoose.Types.ObjectId(req.params.id);
        userModel.findOne({ _id: objId }, (err, user) => {
            if (err) {
                next(err)
            }
            if (user == null) {
                res.status(404).json(
                    {
                        "message": "That user does not exist!"
                    }
                )
            }

            user.username = (req.body.username || user.username);
            user.email = (req.body.email || user.email);
            user.password = (req.body.password || user.password);
            user.userType = (req.body.userType || user.userType);

            user.save();
            res.status(200).json(user)
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when updating (PATCH) a specific user"
            }
        )
        console.log(e);
    }
}).delete((req, res, next) => {
    try {
        var objId = new mongoose.Types.ObjectId(req.params.id);
        userModel.findOneAndDelete({ _id: objId }, (err, user) => {
            if (err) {
                return next(err)
            }
            if (user == null) {
                return res.status(404).json(
                    {
                        "message": "User not found"
                    }
                )
            }
            res.status(200).json(user)
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when deleting a specific user"
            }
        )
        console.log(e);
    }
})

userRouter.route('/:id/reviews').get((req, res, next) => {
    // gets a specific users reviews using the provided user id 
    try {
        let userId = req.params.id
        if (userId !== undefined) {
            var objId = mongoose.Types.ObjectId(userId);
            userModel.findOne({ _id: objId }, (err, user) => {
                if (err) {
                    return next(err)
                }
                if (user == null) {
                    return res.status(404).json(
                        {
                            "message": "User not found"
                        }
                    )
                }
                reviewModel.find({ owner: user._id }, (err, review) => {
                    if (err) {
                        return next(err)
                    }
                    console.log(`User: ${user} - Review: ${review}`)
                    res.status(200).json(review)
                })
            })
        } else {
            res.status(403).json(
                {
                    "message": "No user specified"
                }
            )
        }
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when getting reviews for a specific user"
            }
        )
        console.log(e);
    }
}).post((req, res, next) => {
    // creating a review for a specific user using the provided user id
    console.log('Entered post of users/reviews')
    try {
        if (req.params.id !== undefined) {
            var userId = mongoose.Types.ObjectId(req.params.id);
            if (req.body.reviewId !== undefined) {
                var reviewId = mongoose.Types.ObjectId(req.body.reviewId);
                console.log(`ReviewId: ${reviewId}`)
                userModel.findOneAndUpdate({ _id: userId },
                    {
                        $push:
                        {
                            "review": reviewId
                        }
                    },
                    function (error, updated) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log('Inserted review into array - ' + updated)
                            res.status(201).json(
                                {
                                    "message": "Review successfully inserted into user object"
                                }
                            )
                        }
                    }
                )
            }
        }
    } catch (error) {
        res.status(500).json(
            {
                "message": "Error when posting a review for a specific user"
            }
        )
        console.log(error)
    }
})

userRouter.route('/:id/suggestions').get((req, res, next) => {
    // get a specific users suggestions by using the provided user id
    try {
        let userId = req.params.id
        if (userId !== undefined) {
            var objId = mongoose.Types.ObjectId(req.params.id);
            userModel.findById({ _id: objId }, (err, user) => {
                if (err) {
                    next(err)
                }
                if (user == null) {
                    return res.status(404).json(
                        {
                            "message": "User not found"
                        }
                    )
                }
                suggestionModel.find({ username: user.username }, (err, suggestion) => {
                    if (err) {
                        next(err)
                    }
                    res.status(200).json(
                        {
                            "suggestion": suggestion
                        }
                    )
                })
            })
        } else {
            res.status(403).json(
                {
                    "message": "No user specified"
                }
            )
        }
    } catch (error) {
        res.status(500).json(
            {
                "message": "Error when when getting a specific users suggestions"
            }
        )
        console.log(error);
    }
}).post((req, res, next) => {
    // creating a suggestion for a specific user using the provided user id
    console.log('Entered post of users/reviews')
    try {
        if (req.params.id !== undefined) {
            var userId = mongoose.Types.ObjectId(req.params.id);
            if (req.body.reviewId !== undefined) {
                var reviewId = mongoose.Types.ObjectId(req.body.reviewId);
                console.log(`ReviewId: ${reviewId}`)
                userModel.findOneAndUpdate({ _id: userId },
                    {
                        $push:
                        {
                            "review": reviewId
                        }
                    },
                    function (error, updated) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log('Inserted review into array - ' + updated)
                            res.status(201).json(
                                {
                                    "message": "Review successfully inserted into user object"
                                }
                            )
                        }
                    }
                )
            }
        }
    } catch (error) {
        res.status(500).json(
            {
                "message": "Error when creating a suggestion for a specific user"
            }
        )
        console.log(error)
    }
})

userRouter.get('/:id/reviews/:rid', (req, res, next) => {
    // gets a specific review (:rid) that a specific user (:id) has made, by using the provided user id (:id) and the provided (:rid)
    try {
        let userId = req.params.id
        let reviewId = req.params.rid
        if (userId !== undefined) {
            if (reviewId !== undefined) {
                //if there is both a review & user ID provided in the params
                var userObjId = mongoose.Types.ObjectId(userId);
                var reviewObjId = mongoose.Types.ObjectId(reviewId);

                userModel.findOne({ _id: userObjId }, (err, user) => {
                    if (err) {
                        next(err)
                    }
                    if (user == null) {
                        return res.status(404).json(
                            {
                                "message": "User not found"
                            }
                        )
                    }
                    console.log('User with that id exists')
                    reviewModel.findOne({ _id: reviewObjId, owner: userObjId }, (err, review) => {
                        if (err) {
                            next(err)
                        }
                        if (review == null) {
                            return res.status(404).json(
                                {
                                    "message": "Review not found"
                                }
                            )
                        }
                        console.log('Product with that id exists')
                        res.status(200).json(review)
                    })
                })
            } else {
                res.status(403).json(
                    {
                        "message": "No review specified"
                    }
                )
            }
        } else {
            res.status(403).json(
                {
                    "message": "No user specified"
                }
            )
        }
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when getting a specific review made by a specific user"
            }
        )
        console.log(e);
    }
})

userRouter.delete('/:id/reviews/:rid', (req, res, next) => {
    // deletes specific reviews from a specific user using the provided user id (:id) and the review id (:rid)
    try {
        if (req.params.id !== undefined) {
            var userId = mongoose.Types.ObjectId(req.params.id);

            if (req.params.rid !== undefined) {
                var reviewId = mongoose.Types.ObjectId(req.params.rid)
                userModel.findOneAndUpdate({ _id: userId }, {
                    $pull: {
                        review:
                        {
                            $in: reviewId
                        }
                    },
                    upsert: false, multi: false
                },
                    function (error, updated) {
                        if (error) {
                            return res.status(500).json(
                                {
                                    "message": "Failed to remove review from user array"
                                }
                            )
                        } else {
                            console.log('Removed review from user array - ' + updated)
                        }
                        res.status(200).json(updated)
                    }
                )
            }
        }
    } catch (error) {
        res.status(500).json(
            {
                "message": "Error when deleting a specified review made by a specified user"
            }
        )
        console.log(error)
    }
})

module.exports = userRouter;