var express = require('express')
var locationRouter = express.Router()
var itemRouter = express.Router()
var bodyparser = require('body-parser')
var locationsModels = require('../models/locationModel')
var itemModels = require('../models/itemModel')
const mongoose = require("mongoose");

locationRouter.use(bodyparser.json())
locationRouter.use(bodyparser.urlencoded({extended: false}))


var locationModel= mongoose.model('locations',locationsModels)
var itemModel= mongoose.model('products',itemModels)

locationRouter.route('/').get((req, res, next) => {
    try {
        //all items
        locationModel.find((err, location) => {
            if (err) {
                return next(err)
            }
            res.status(200).json(
                {
                    "locations": location
                }
            )
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting all locations!"
            }
        );
    }
}).post((req, res, next) => {
    try {
        //create new item
        console.log("creating location")

        let newLocation = new locationModel({
            name: req.body.name,
            description: req.body.description,
            country: req.body.country,
            city: req.body.city,
            street: req.body.street,
            zipcode: req.body.zipcode,
        });

        newLocation.save(function (error,item) {
            if (error) {
                return next(error)
            }
            res.status(201).json(
                {
                    "locations": newLocation
                }
            )
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when creating new locations"
            }
        );
    }
}).delete((req, res, next) => {
    try {
        //remove all locations
        locationModel.deleteMany((err, location) => {
            if (err) {
                return next(err)
            }
            if (location["deletedCount"] == 0 ) {
                return res.status(200).json(
                    {
                        "message": "No items!"
                    }
                )
            }
            res.status(200).json(
                {
                    "message": "All locations have been deleted!"
                }
            );
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when deleting all locations"
            }
        );
    }
})
locationRouter.route('/:id').get((req, res, next) => {
    //get item with specific id
    try {
        var objectId = mongoose.Types.ObjectId(req.params.id)
        locationModel.findOne({_id: objectId}, (err, location) => {
            if (err) {
                return next(err)
            }
            if (location == null) {
                return res.status(404).json(
                    {
                        "message" : "Location with that id cannot be found!"
                    }
                )
            }
            res.status(200).json(location);
            locationModel.find().populate('review')
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting a specific location"
            }
        );
    }
}).put((req, res, next) =>{
    //update item with specific id
    try {
        var objectId = mongoose.Types.ObjectId(req.params.id)
        var putBody = req.body
        locationModel.findById({_id: objectId} , (err, location) => {
            if (err) {
                return next(err)
            }
            if (location == null) {
                return res.status(404).json(
                    {
                        "message" : "Location with that id cannot be found!"
                    }
                )
            }
            location.name = putBody.name;
            location.description = putBody.description;
            location.country = putBody.country;
            location.city = putBody.city;
            location.street = putBody.street;
            location.zipcode = putBody.zipcode;
            //owner??
            //review??
            location.save();
            res.status(200).json(location);

        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when updating (PUT) a specific location"
            }
        );
    }
}).patch((req, res, next) =>{
    try {
        //update specific part of item with specific id
        var objectId = mongoose.Types.ObjectId(req.params.id)
        var patchBody = req.body
        locationModel.findOne({_id: objectId} , (err, location) => {
            if (err) {return next(err)}
            if (location == null) {
                return res.status(404).json(
                    {
                        "message" : "Location with that id cannot be found!"
                    }
                )
            }
            location.name = (patchBody.name || location.name) ;
            location.description = (patchBody.description || location.description);
            location.country = (patchBody.country || location.country);
            location.city = (patchBody.city || location.city);
            location.street = (patchBody.street || location.street);
            location.zipcode = (patchBody.zipcode || location.zipcode);

            location.save();
            res.status(200).json(location);

        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when updating (PATCH) a specific location"
            }
        );
    }
}).delete((req, res, next) =>{
    //remove item with specific id
    try {
        var objectId = new mongoose.Types.ObjectId(req.params.id)
        locationModel.findOneAndDelete({_id: objectId}, (err, location) => {
            if (err) {
                return next(err)
            }
            if (location == null) {
                return res.status(404).json(
                    {
                        "message" : "Location with that id cannot be found!"
                    }
                )
            }
            res.status(200).json(location);
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when deleting a specific location"
            }
        );
    }
})
locationRouter.route('/:id/items').get((req, res, next) => { 
    //gets all items at a specific locations
    try {
        let locationId = req.params.id
        if(locationId !== undefined) {
            var objId = mongoose.Types.ObjectId(locationId);
            locationModel.findOne({_id: objId}, (err, location) => {
                if (err) {
                    next(err)
                }
                itemModel.find({location: location._id}, (err, item) => {
                    if (err) {
                        next(err)
                    }
                    res.status(200).json(item)
                })
            })
        } else {
            res.status(400).json(
                {
                    "message":"No item specified"
                }
            )
        }
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error when getting all items at a specific location"
            }
        );
    }
}).post((req, res, next) => { 
    //creates a new item for a specified location
    try {
        let locationId = req.params.id
        if(locationId !== undefined) {
            var objId = mongoose.Types.ObjectId(locationId);
            locationModel.findOne({_id: objId}, (err, location) => {
                if (err) {
                    next(err)
                }
                //create new item
                let newItem = new itemModel(req.body);
                newItem.save(function (err){
                    if(err){
                        return next(err)
                    }
                })
                newItem.populate('location',function (error){ //adds the new item to the locaiton
                    if (error) {
                        return next(error)
                    }
                    if(newItem.location== null){
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
                "message": "Error when creating a new item for a specific location"
            }
        );
    }
})
locationRouter.route('/page/:page').get((req, res, next) => {
    try {
        //pagination
        const locationsPerPage = 2;
        if (req.params.page !== undefined) {
            console.log(req.params.page);
            const pageNumber = req.params.page || 1;
            console.log(pageNumber);
            let query = locationModel.find().limit(locationsPerPage)
            if (pageNumber > 1) {
                query = locationModel.find().skip((pageNumber-1) * locationsPerPage).limit(locationsPerPage)
            }
            query.exec(function(err, locations) {
                locationModel.countDocuments().exec(function(err, count) {
                    if (err) {
                        return next(err)
                    }
                    console.log(locations);
                    res.status(200).json(
                        {
                            "locations": locations,
                            "page": pageNumber,
                            "per_page": locationsPerPage,
                            "pages": Math.ceil(count / locationsPerPage)
                        }
                    )
                })
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json(
            {
                "message": "Something went wrong when loading pagess"
            }
        )
    }
})
module.exports = locationRouter;