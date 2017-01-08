/*
* Inventory Route provides the RESTful API for database access.
* It is protected by a JWT authentication middleware file.
*/

var express = require('express');
var jwtAuth = require('../jwtauth.js');
var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');

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
        } else {
            res.end('An error occured.');
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
        } else {
            res.end('An error occured.');
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
            res.send(newItem);
        } else {
            res.end('An error occured.');
        }
    });
});

//put requests update a single result by ObjectID
router.put('/:id', function(req, res) {
    var itemUpdate = req.body;
    //remove '_id' field from request body to prevent conflict during update
    var itemID = ObjectID(req.params.id);
    delete itemUpdate._id;  
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).update({_id: itemID}, itemUpdate, {safe: true}, function(error, result, status) {
        if (!error) {
            res.send(itemUpdate);
        } else {
            res.end('An error occured.');
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
            res.send(itemId);
        } else {
            res.end('An error occured.');
        }
    });
});

//update time of last 'Sync to database' event
router.put('/sync/:id', function(req, res) {
    var db = req.db;
    var requestedCollection = req.inventoryName;
    var lastSync = moment.utc().toJSON();
    console.log(lastSync);
    db.collection(requestedCollection).update({'date': 'date'}, { $set: {'lastSync': lastSync}}, {safe: true}, function(error, result, status) {
        if (!error) {
            res.send(JSON.stringify(lastSync));
        } else {
            res.end('An error occured.');
        }
    });
});

module.exports = router;