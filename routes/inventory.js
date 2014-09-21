/*
* Inventory Route provides the RESTful API for database access.
* It is protected by a JWT authentication middleware file.
*/

var express = require('express');
var router = express.Router();
var jwtAuth = require('../jwtauth.js');
var ObjectID = require('mongodb').ObjectID;

router.all('/*', jwtAuth);

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

router.get('/:id', function(req, res) {
    var itemID = new ObjectID(req.params.type);
    var db = req.db;
    var requestedCollection = 'parkavenue';
    db.collection(requestedCollection, function(err, col) {
        col.findOne({_id: itemID}, function(err, result) {
            if(!err) {
                res.json(result);
            }
        });
    });
});

router.post('/', function(req, res) {
    var newItem = req.body;
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection, function(err, col) {
        col.insert(newItem, {safe: true}, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        });
    });
});

router.put('/:id', function(req, res) {
    var itemID = ObjectID(req.params.id);
    console.log('item id:' + itemID);
    var itemUpdate = req.body;
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

router.delete('/:id', function(req, res) {
    var itemId = req.params.id;
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection, function(err, col) {
        col.removeById(itemId, {safe: true}, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg: 'error: ' + err});
        });
    });
});

module.exports = router;