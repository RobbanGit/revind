var express = require('express');
var reviewsRouter = express.Router();
var reviewModels = require('../models/reviewModel');
var mongoose = require('mongoose')
var bodyparser = require('body-parser')
var reviewHelper = require('./helpers/validator')

var reviewModel = new mongoose.model('reviews', reviewModels)

reviewsRouter.route('/').get((req, res, next) => {
    try {
        reviewModel.find((err, review) => {
            if (err) {
                next(err)
            }
            res.status(200).json(review)
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting all reviews"
            }
        );
    }
}).post((req, res, next) => {
    // creates a new review
    try {
        let verify = reviewHelper;
        console.log(req.body);

        let bodyTitle = req.body.title
        let bodyDesc = req.body.description
        let bodyRating = req.body.rating

        //check if allowed values before saving to db
        //methods return booleans
        let allowedTitle = verify.checkTitle(bodyTitle);
        let allowedDesc = verify.checkDescription(bodyDesc);
        let allowedRating = verify.checkRating(bodyRating);

        var owner = mongoose.Types.ObjectId(req.body.owner);
        var product = mongoose.Types.ObjectId(req.body.product);

        if (allowedTitle && allowedDesc && allowedRating) {
            var newReview = new reviewModel({
                title: bodyTitle,
                description: bodyDesc,
                rating: bodyRating,
                owner:  owner,
                product:  product
            })

            newReview.save(function(error, review) {
                if (error) {
                    console.log(`[Post 'review/']Error Message: ${error}`)
                } else {
                    res.status(201).send(newReview)
                }
            })
        } else if (!allowedTitle) {
            console.log("too long title");
            res.status(403).send(
                {
                    "Message":"too long title"
                }
            )
        } else if (!allowedDesc) {
            console.log("too long desc");
            res.status(403).send(
                {
                    "Message":"too long desc"
                }
            )
        } else if (!allowedRating) {
            console.log("not a valid rating");
            res.status(403).send(
                {
                    "Message":"Not allowed rating"
                }
            )
        } else {
            res.status(404).send(
                {
                    "Message":"Not Found"
                }
            )
        }
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting all reviews"
            }
        );
    }
}).put((req, res, next) => {
    // updates a review
    try {
        let reviewID = mongoose.Types.ObjectId(req.params.id)
        reviewModel.findOne({_id: reviewID}, (error, review) => {
            if (error) {
                next(error)
            }
            if (review === null) {
                res.status(404).json(
                    {
                        "message":"Review Not Found"
                    }
                )
            }
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when updating (PUT) a review"
            }
        );
    }
}).delete((req, res, next) => {
    //delete all reviews
    try {
        reviewModel.deleteMany((err, review) => {
            if (err) {
                next(err)
            }
            if (review["deletedCount" == null]) {
                res.json(
                    {
                        "message": "No reviews to delete"
                    }
                )
            }
            res.status(200).json(
                {
                    "message": "All reviews have been deleted"
                }
            )
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when deleting all reviews"
            }
        );
    }
})

reviewsRouter.route('/:id').get((req, res, next) => {
    try {
        let reqRevId = req.params.id
        if (reqRevId !== undefined) {
            let reviewId = mongoose.Types.ObjectId(reqRevId);
            reviewModel.findOne({_id:reviewId},(error, review) => {
                if (error) {
                    next(error)
                }
                if (review === null) {
                    res.status(404).json(
                        {
                            "message":"Review Not Found"
                        }
                    )
                } else {
                    res.status(200).json(review);
                }
            })
        } else {
            res.status(403).json(
                {
                    "message": "No review specified"
                }
            )
        }
    } catch(e) {
        res.status(500).json(
            {
                "message": "Something went wrong when retrieving a review"
            }
        )
        console.log(e);
    }

}).put((req, res, next) => {
    // updates a review with a given review id
    try {
        let reviewId = mongoose.Types.ObjectId(req.params.id);
        let bodyTitle = req.body.title
        let bodyDesc = req.body.description
        let bodyRating = req.body.rating
        reviewModel.findOne({_id: reviewId}, (err, review) => {
            if (err) {
                next(err)
            }
            if (review == null) {
                res.status(404).json(
                    {
                        "message": "That review does not exist!"
                    }
                )
            }
            review.title = bodyTitle;
            review.description = bodyDesc;
            review.rating = bodyRating;
            review.save();
            res.status(200).json(review)
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error updating (PUT) with a given id "
            }
        );
    }
}).patch((req, res, next) => {
    // updates a review via PATCH and with a given review id
    try {
        let reviewId = mongoose.Types.ObjectId(req.params.id);
        let bodyTitle = req.body.title
        let bodyDesc = req.body.description
        let bodyRating = req.body.rating
        reviewModel.findOne({_id: reviewId}, (err, review) => {
            if (err) {
                next(err)
            }
            if (review == null) {
                res.status(404).json(
                    {
                        "message": "That review does not exist!"
                    }
                )
            }

            review.title = (bodyTitle || review.title);
            review.description = (bodyDesc || review.description);
            review.rating = (bodyRating || review.rating);

            review.save();
            res.status(200).json(review)
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error updating (PATCH) with a given id "
            }
        );
    }
}).delete((req, res, next) => { 
    //deletes a specific review with a given ID
    try {
        let reviewDeleteId = new mongoose.Types.ObjectId(req.params.id);
        reviewModel.findOneAndDelete({_id: reviewDeleteId}, (err, review) => {
            if (err) {
                return next(err)
            }
            if (review == null) {
                return res.status(404).json(
                    {
                        "message": "User not found"
                    }
                )
            }
            res.status(200).json(review)
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when deleting a review with specified ID "
            }
        );
    }
})
module.exports = reviewsRouter;