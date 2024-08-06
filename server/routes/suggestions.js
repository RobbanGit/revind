var express = require('express');
var suggestionsRouter = express.Router();
var suggestionsModels = require('../models/suggestionModel');
var mongoose = require('mongoose')
var bodyparser = require('body-parser')
var helper = require('./helpers/validator')

var suggestionsModel = new mongoose.model('suggestions', suggestionsModels)

suggestionsRouter.route('/').get((req, res, next) => {
    try {
        suggestionsModel.find((err, suggestions) => {
            if (err) {
                next(err)
            }
            res.status(200).json(suggestions)
        })
    } catch (err) {
        res.status(500).json(
            {
                "message": "Error getting all suggestions"
            }
        );
    }
}).post((req, res, next) => {
    // creating a suggestion and saving it to the db
    try{
        let feedback = req.body[0].feedback;
        let validEmail = helper.validateEmail(req.body[0].email)
        var owner = (req.body[0].owner);
        console.log(req.body);
        if (feedback.length < 3501 && validEmail) {
            var newSuggestions = new suggestionsModel(
                {
                    userId: owner,
                    username: req.body[0].username,
                    email: req.body[0].email,
                    subject: req.body[0].subject,
                    feedback: req.body[0].feedback
                }
            );
            console.log(req.body);
            newSuggestions.save(function(error, suggestions) {
                if (error) {
                    console.log(`[Post 'suggestions/']Error Message: ${error}`)
                } else {
                    res.status(201).send(newSuggestions)
                }
            })
        } else {
            res.status(403).json(
                {
                    "Message": "Feedback too long"
                }
            )
        }
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error creating a suggestion"
            }
        )
        console.log(e)
    }
}).delete((req, res, next) => {
    // deletes all suggestions
    try {
        suggestionsModel.deleteMany((err, suggestion) => {
            if (err) {
                next(err)
            }
            if (suggestion["deletedCount" == null]) {
                res.json(
                    {
                        "message": "No suggestions to delete"
                    }
                )
            }
            res.status(200).json(
                {
                    "message": "All suggestions have been deleted"
                }
            )
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when deleting all suggestions"
            }
        )
        console.log(e)
    }
})

suggestionsRouter.route('/:id').get((req, res, next) => {
    // gets a specific suggestion using the provided id
    try {
        let reqSuggestId = req.params.id
        if (reqSuggestId !== undefined) {
            let suggestionsId = mongoose.Types.ObjectId(reqSuggestId);
            suggestionsModel.findOne({_id:suggestionsId},(error, suggestions) => {
                if (error) {
                    next(error)
                }
                if (suggestions === null) {
                    res.status(404).json(
                        {
                            "message":"Suggestion Not Found"
                        }
                    )
                } else {
                    res.status(200).json(suggestions);
                }
            })
        } else {
            res.status(403).json(
                {
                    "message":"No suggestion specified"
                }
            )
        }
    } catch (e) {
        res.status(500).json(
            {
                "message": "Something went wrong when retrieving a specific suggestion"
            }
        )
        console.log(e);
    }

}).put((req, res, next) => {
    // updates a suggestion with a given id
    try{
        let suggestionsId = mongoose.Types.ObjectId(req.params.id);
        let validEmail = helper.validateEmail(req.body[0].email);

        suggestionsModel.findOne({_id: suggestionsId}, (err, suggestions) => {
            if (err) {
                next(err)
            }
            if (suggestions == null) {
                res.status(404).json(
                    {
                        "message": "That suggestions does not exist!"
                    }
                )
            } else {
                if (req.body[0].feedback.length < 3501 && validEmail) {
                    suggestions.username = req.body[0].username;
                    suggestions.email = req.body[0].email;
                    suggestions.subject = req.body[0].subject;
                    suggestions.feedback = req.body[0].feedback;
                    suggestions.save();
                    res.status(200).json(suggestions)
                } else {
                    res.status(403).json({"message":"Forbidden Suggestion"})
                }
            }
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when updating (PUT) a specific suggestion"
            }
        )
        console.log(e)
    }
}).patch((req, res, next) => {
    // updates data in a suggestion provided with id
    try {
        let suggestionsId = mongoose.Types.ObjectId(req.params.id);
        suggestionsModel.findOne({_id: suggestionsId}, (error, suggestions) => {
            if (error) {
                next(error)
            }
            if (suggestions == null) {
                res.status(404).json(
                    {
                        "message": "Suggestion does not exist!"
                    }
                )
            }

            suggestions.username = (req.body[0].username || suggestions.username);
            suggestions.email = (req.body[0].email || suggestions.email);
            suggestions.subject = (req.body[0].subject || suggestions.subject);
            suggestions.feedback = (req.body[0].feedback || suggestions.feedback);
            suggestions.save();
            res.status(200).json(suggestions);
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when updating (PUT) a specific suggestion"
            }
        )
        console.log(e)
    }
}).delete((req, res, next) => {
    // deletes a specific suggestion from given id
    try {
        let suggestionsDeleteId = new mongoose.Types.ObjectId(req.params.id);
        suggestionsModel.findOneAndDelete({_id: suggestionsDeleteId}, (err, suggestions) => {
            if (err) {
                return next(err)
            }
            if (suggestions == null) {
                return res.status(404).json(
                    {
                        "message": "suggestions not found"
                    }
                )
            }
            res.status(200).json(suggestions)
        })
    } catch (e) {
        res.status(500).json(
            {
                "message": "Error when deleting a specific suggestion"
            }
        )
        console.log(e)
    }
})
module.exports = suggestionsRouter;