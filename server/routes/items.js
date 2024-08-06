var express = require('express')
var itemRouter = express.Router()
var bodyparser = require('body-parser')
var itemModels = require('../models/itemModel')
const mongoose = require("mongoose");
var locationsModels = require('../models/locationModel')
var reviewModels = require('../models/reviewModel')
var reviewHelper = require('./helpers/validator')


itemRouter.use(bodyparser.json())
itemRouter.use(bodyparser.urlencoded({extended: false}))

var itemModel= mongoose.model('products',itemModels)
var reviewModel = mongoose.model('reviews', reviewModels)

itemRouter.route('/').get((req, res, next) => {
    //all items
    try {
        const givenLimit = req.query.limit
        const givenSort = req.query.sort
        const givenPage = req.query.page
        const limitNumberOfItems = givenLimit ? parseInt(givenLimit):10
        const sortItems = givenSort ? parseInt(givenSort):1
        const page = givenPage ? parseInt(givenPage):1
        itemModel.find((err, item) => {
            if (err) {
                return next(err)
            }
            res.status(200).json(
                {
                    "items": item
                }
            )
        }).limit(limitNumberOfItems)
            .sort({
            price: sortItems
        })
            .populate('locations')
    } catch (error) {
        res.status(500).send()
    }
}).post((req, res, next) => {
    try {
        //create new item
        console.log("creating item")
        let newItem = new itemModel({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location
        });
        newItem.save(function (err){
            if(err){
                return next(err)
            }
        })
        newItem.populate('location',function (error){
            if (error) {
                return next(error)
            }
            if(newItem.location== null) {
                newItem.deleteOne();
                return res.status(400).json(
                    {
                        "message": "Location Id not in database"
                    }
                )
            }
            res.status(201).json(
                {
                    "items": newItem
                }
            )
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when creating a new item!"
            }
        );
    }
}).delete((req, res, next) => {
    //remove all item
    try {
        itemModel.deleteMany((err, item) => {
            if (err) {
                return next(err)
            }
            if (item["deletedCount"] == 0 ) {
                return res.status(200).json(
                    {
                        "message": "No items!"
                    }
                )
            }
            res.status(200).json(
                {
                    "message": "All items have been deleted!"
                }
            );
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when deleting all items!"
            }
        );
    }
})
itemRouter.route('/:id').get((req, res, next) => {
    try {
        //get item with specific id
        var objectId = mongoose.Types.ObjectId(req.params.id)
        itemModel.findById({_id: objectId}, (err, item) => {
            if (err) {
                return next(err)
            }
            if (item == null) {
                return res.status(404).json(
                    {
                        "message" : "Item with that id cannot be found!"
                    }
                )
            }
            res.status(200).json(item);
            itemModel.find().populate('review') // adds all related reviews to this item
        }).populate('location') // adds the related location details
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting a specific item!"
            }
        );
    }
}).put((req, res, next) => {
    try {
        //update item with specific id
        var objectId = mongoose.Types.ObjectId(req.params.id)
        itemModel.findById({_id: objectId} , (err, item) => {
            if (err) {
                return next(err)
            }
            if (item == null) {
                return res.status(404).json(
                    {
                        "message" : "Item with that id cannot be found!"
                    }
                )
            }

            item.title = req.body.title;
            item.description = req.body.description;
            item.price = req.body.price;
            item.save();
            res.status(200).json(item);

        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when updating (PUT) an item!"
            }
        );
    }
}).patch((req, res, next) =>{
    //update specific part of item with specific id
    try {
        var objectId = mongoose.Types.ObjectId(req.params.id)
        itemModel.findOne({_id: objectId} , (err, item) => {
            if (err) {
                return next(err)
            }
            if (item == null) {
                return res.status(404).json(
                    {
                        "message" : "Item with that id cannot be found!"
                    }
                )
            }

            item.title = (req.body.title||item.title);
            item.description = (req.body.description||item.description);
            item.price = (req.body.price||item.price);

            item.save();
            res.status(200).json(item);

        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when updating (PATCH) an item!"
            }
        );
    }
}).delete((req, res, next) =>{
    try {
        //remove item with specific id
        var objectId = new mongoose.Types.ObjectId(req.params.id)
        itemModel.findOneAndDelete({_id: objectId}, (err, item) => {
            if (err) {
                return next(err)
            }
            if (item == null) {
                return res.status(404).json(
                    {
                        "message" : "Item with that id cannot be found!"
                    }
                )
            }
            res.status(200).json(item);
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when deleting a specific item!"
            }
        );
    }
})
itemRouter.route('/:id/reviews').get((req, res, next) => {
    try {
        //  console.log('Entering reviews for users')
        let itemId = req.params.id
        if(itemId !== undefined) {
            var objId = mongoose.Types.ObjectId(itemId);
            itemModel.findOne({_id: objId}, (err, item) => {
                if (err) {
                    next(err)
                }
                reviewModel.find({product: item._id}, (err, review) => {
                    if (err) {
                        next(err)
                    }
                    // console.log(`Item: ${item} - Review: ${review}`)
                    res.status(200).json(review)
                })
            })
        } else {
            res.status(403).json(
                {
                    "message":"No item specified"
                }
            )
        }
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting reviews of a specific item!"
            }
        );
    }
}).post((req, res, next) => {
    //  console.log('Entering reviews for users')
    try {
        let itemId = req.params.id
        if (itemId !== undefined) {
            var objId = mongoose.Types.ObjectId(itemId);
            itemModel.findOne({_id: objId}, (err, item) => {
                let itemId = req.params.id
                if (err) {
                    next(err)
                }
                let verify = reviewHelper;
                console.log(req.body);

                //check types and allowed data before saved to db
                //called methods return booleans
                let allowedTitle = verify.checkTitle(req.body.title);
                let allowedDesc = verify.checkDescription(req.body.description);
                let allowedRating = verify.checkRating(req.body.rating);

                var owner = mongoose.Types.ObjectId(req.body.owner);
                var product= itemId;
                if (allowedTitle && allowedDesc && allowedRating) {
                    var newReview = new reviewModel({
                        title: req.body.title,
                        description: req.body.description,
                        rating: req.body.rating,
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
                            "Message":""
                        }
                    )
                }

            })
        } else {
            res.status(403).json(
                {
                    "message":"No item specified"
                }
            )
        }
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when creating a new item!"
            }
        );
    }
})

itemRouter.route('/locations/:id').get((req, res, next) => {
    try {
        let locationId = req.params.id
        if (locationId !== undefined) {
            var objId = mongoose.Types.ObjectId(locationId);
            itemModel.find({location: objId}, (err, item) => {
                if (err) {
                    return next(err)
                }
                res.status(200).json(item)
            })
        }
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting items for a location"
            }
        );
    }
})
module.exports = itemRouter;
