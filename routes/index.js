var express = require('express');
var moment = require('moment');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

var router = express.Router();

//basic regex strip special characters function (no whitespace allowed here)
var stripSpecialChars = function(original) {
    return original.replace(/[^\w]/gi, '');
};

// GET home page
router.get('/', function(req, res) {
    res.render('login');
});

// upon login, check credentials, then create JWT token and render main application page
router.post('/login', function(req, res) {
    var db = req.db;
    var app = req.app;
    var userCollection = stripSpecialChars(req.body.name);
    var password = req.body.password;
    var bcryptPass;
    db.collection(userCollection, {strict: true}, function(err, col) {
    
        if (err) {
            // if collection doesn't exist or there's a problem, re-render login
            res.render('login', {errorMessage: err});
        } else {
            
            //check utility document for password match.
            db.collection(userCollection).findOne({'util':'util'}, function(err, result) {
                if (err) {
                    console.log("error finding util: " + err);
                } else {
                    console.log(result);
                    bcryptPass = result.pass;
                    
                    // check for correct password
                    bcrypt.compare(password, bcryptPass, function(hashErr, hashRes) {
                        if (hashErr || hashRes !== true) {
                            console.log(password);
                            console.log(bcryptPass);
                            console.log(hashErr);
                            res.render('login', {errorMessage: 'Invalid password.'});
                        } else {
                            console.log(hashRes);
                            console.log(password);
                            console.log(bcryptPass);
                            
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
                            }); // End Async Series
                        }
                    }); // End bcrypt.compare
                }
            });
        }
    });
});

// upon create, set up new collection, then render page
router.post('/create', function(req, res) {
    var db = req.db;
    var app = req.app;
    var newCollection = stripSpecialChars(req.body.newName);
    var newPassword = req.body.newPassword;
    
    //Password must contain at least 8 characters including a capital letter,
    //a number, a special character, and cannot have harmful characters.
    var passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%?&][^\s{}<>#*,;()|]{8,}/;
    
    // a hidden form field is used to protect against bots. "notHuman" is changed to "human" via Jquery client-side.
    var passPhrase = req.body.isHuman;
    if (passPhrase === 'notHuman') {
        res.render('login', {errorMessage: 'Humans only please.'});
    } else if (!passReg.test(newPassword)) {
        res.render('login', {errorMessage: 'invalid password...'});
    } else {
        //{strict:true} prevents duplicate collection creation.
        db.createCollection(newCollection, {strict: true}, function(err, collection) {
            if (err) {
                res.render('login', {errorMessage: err});
            } else {
                bcrypt.hash(newPassword, null, null, function(err, bcryptPass) {
                    console.log(bcryptPass);
                    db.collection(newCollection).insert({'util' : 'util', 'pass' : bcryptPass}, {safe:true}, function(error, result) {
                        if(!error) {
                            console.log("hashed password " + bcryptPass + " inserted");
                            
                            //create jwt token
                            var expires = moment().add('days', 7).valueOf();
                            var token = jwt.encode({
                                iss: newCollection,
                                exp: expires
                            }, app.get('jwtTokenSecret'));
                            
                            res.render('index', {
                                title: newCollection,
                                token: token
                            });
                            console.log(token);
                        } else {
                            console.log("there was an error: " + error);
                        }
                    });
                });
            }
        });
    }
});

module.exports = router;
