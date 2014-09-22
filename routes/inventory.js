/*
* Inventory Route provides the RESTful API for database access.
* It is protected by a JWT authentication middleware file.
*/

var express = require('express');
var jwtAuth = require('../jwtauth.js');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

//any API call must pass JWT authentication
router.all('/*', jwtAuth);

//get requests with 'type' specified filter results by category, returning a sub-collection
router.get('/:type', function(req, res) {
    var type = req.params.type;
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).find({category: type}).toArray(function(err, items) {
        if(!err) {
            res.json(items);
        }
    });
});

//get requests with an id specified return a single result by ObjectID
router.get('/:id', function(req, res) {
    var itemID = new ObjectID(req.params.id);
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).findOne({_id: itemID}, function(err, result) {
        if(!err) {
            res.json(result);
        }
    });
});

//post requests have a 'category' field specified client-side for later retrieval by category
router.post('/', function(req, res) {
    var newItem = req.body;
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).insert(newItem, {safe: true}, function(error, result, status) {
        if (!error) {
            console.log("here's the status: " + status);
            res.send(newItem);
        } else {
            console.log("heres the error: " + error);
        }
    });
});

//put requests update a single result by ObjectID
router.put('/:id', function(req, res) {
    var itemUpdate = req.body;
    //remove '_id' field from request body to prevent conflict during update
    var itemID = ObjectID(req.params.id);
    console.log('item id:' + itemID);
    delete itemUpdate._id;  
    console.log(req.body);
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).update({_id: itemID}, itemUpdate, {safe: true}, function(error, result, status) {
        if (!error) {
            console.log("here's the status: " + status);
            res.send(itemUpdate);
        } else {
            console.log("heres the error: " + error);
        }
    });
});

//delete single result by ObjectID
router.delete('/:id', function(req, res) {
    var itemId = req.params.id;
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).removeById(itemId, {safe: true}, function(error, result, status) {
        if (!error) {
            console.log("here's the status: " + status);
            res.send(itemId);
        } else {
            console.log("heres the error: " + error);
        }
    });
});

module.exports = router;