var express = require('express');
var moment = require('moment');
var jwt = require('jwt-simple');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('login');
});

router.post('/', function(req, res) {
    var db = req.db;
    var app = req.app;
    var userCollection = req.body.name;
    db.collection(userCollection, {strict: true}, function(err, col) {
        if(err) {
            res.render('login', {errorMessage: err});
        } else {
            
            //create jwt token
            var expires = moment().add('days', 7).valueOf();
            var token = jwt.encode({
                iss: userCollection,
                exp: expires
            }, app.get('jwtTokenSecret'));
            
            console.log(token);
            
            //get initial JSON list of objects before rendering page
            async.series(
                {
                    coffees: function(callback) {
                        db.collection(userCollection).find({category: 'coffee'}).toArray(function(err, items) {
                            if (!err) {
                                callback(null, items);
                            } else {
                                callback(null);
                            }
                        });
                    },
                    blends: function(callback) {
                        db.collection(userCollection).find({category: 'blend'}).toArray(function(err, items) {
                            if (!err) {
                                callback(null, items);
                            } else {
                                callback(null);
                            }
                        });
                    },
                    containers: function(callback) {
                        db.collection(userCollection).find({category: 'container'}).toArray(function(err, items) {
                            if(!err) {
                                callback(null, items);
                            } else {
                            callback(null);
                            }
                        });
                    }
                },
                function(err, results) {
                var collectionPayload = JSON.stringify(results);
                console.log("payload is: " + collectionPayload);
                //render userCollection template with token payload object in JSON format
                //as well as initial collections so that they are bootstrapped into place
                //for initial page load
                res.render('index', {
                    title: userCollection,
                    token: token,
                    payload: collectionPayload
                });
            });
        }
    });
});

module.exports = router;
