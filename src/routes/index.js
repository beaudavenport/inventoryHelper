var express = require('express');
var moment = require('moment');
var jwt = require('jwt-simple');
var jwtAuth = require('../jwtauth.js');
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
router.post('/login', (req, res) => {
  const db = req.dbNew;
  const app = req.app;
  const { name, password } = req.body;
  const userCollection = stripSpecialChars(name);
  let bcryptPass;

  var getCollectionUtility = db.get(userCollection).findOne({'util':'util'})
    .then(utility => utility)
    .catch(function(error) {
      console.log(error);
      res.render('login', {errorMessage: 'Database doesn\'t exist or there\'s an error'});
    });

  getCollectionUtility.then(() => {
    res.render('index', { title: userCollection });
  });
});

// router.post('/login', function(req, res) {
//     var db = req.db;
//     var app = req.app;
//     var userCollection = stripSpecialChars(req.body.name);
//     var password = req.body.password;
//     var bcryptPass;
//     db.collection(userCollection, {strict: true}, function(err, col) {
//         if (err) {
//             // if collection doesn't exist or there's a problem, re-render login
//             res.render('login', {errorMessage: 'Database doesn\'t exist or there\'s an error'});
//         } else {
//
//             //check utility document for password match.
//             db.collection(userCollection).findOne({'util':'util'}, function(err, result) {
//                 if (err) {
//                     res.render('login', {errorMessage: 'there\'s a problem with this inventory.'})
//                 } else {
//                     bcryptPass = result.pass;
//
//                     // check for correct password
//                     bcrypt.compare(password, bcryptPass, function(hashErr, hashRes) {
//                         if (hashErr || hashRes !== true) {
//                             res.render('login', {errorMessage: 'Invalid password.'});
//                         } else {
//
//                              //create jwt token
//                             var expires = moment().add('days', 7).valueOf();
//                             var token = jwt.encode({
//                                 iss: userCollection,
//                                 exp: expires
//                             }, app.get('jwtTokenSecret'));
//
//                             //get initial JSON list of objects before rendering page
//                             async.series(
//                                 {
//                                     coffees: function(callback) {
//                                         db.collection(userCollection).find({category: 'coffee'}).toArray(function(err, items) {
//                                             if (!err) {
//                                                 callback(null, items);
//                                             } else {
//                                                 callback(null);
//                                             }
//                                         });
//                                     },
//                                     blends: function(callback) {
//                                         db.collection(userCollection).find({category: 'blend'}).toArray(function(err, items) {
//                                             if (!err) {
//                                                 callback(null, items);
//                                             } else {
//                                                 callback(null);
//                                             }
//                                         });
//                                     },
//                                     containers: function(callback) {
//                                         db.collection(userCollection).find({category: 'container'}).toArray(function(err, items) {
//                                             if(!err) {
//                                                 callback(null, items);
//                                             } else {
//                                                 callback(null);
//                                             }
//                                         });
//                                     },
//                                     lastSync: function(callback) {
//                                          db.collection(userCollection).findOne({'date': 'date'}, function(err, items) {
//                                             if(!err) {
//                                                 callback(null, items);
//                                             } else {
//                                                 callback(null);
//                                             }
//                                         });
//                                     }
//                                 },
//                                 function(err, results) {
//                                 var lastSync = JSON.stringify(results.lastSync);
//                                 var collectionPayload = JSON.stringify(results);
//
//                                 //render userCollection template with token payload object in JSON format
//                                 //as well as initial collections so that they are bootstrapped into place
//                                 //for initial page load
//                                 res.render('index', {
//                                     title: userCollection,
//                                     lastSync: lastSync,
//                                     token: token,
//                                     payload: collectionPayload
//                                 });
//                             }); // End Async Series
//                         }
//                     }); // End bcrypt.compare
//                 }
//             });
//         }
//     });
// });

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
                res.render('login', {errorMessage: 'Database already exists or is unavailable'});
            } else {
                bcrypt.hash(newPassword, null, null, function(err, bcryptPass) {

                    // insert utility and date fields into collection
                    db.collection(newCollection).insert([
                        {'util' : 'util', 'pass' : bcryptPass},
                        {'date' : 'date', 'lastSync' : 'never'}
                    ], {safe:true}, function(error, result) {
                        if(!error) {

                            //create jwt token
                            var expires = moment().add(7, 'days').valueOf();
                            var token = jwt.encode({
                                iss: newCollection,
                                exp: expires
                            }, app.get('jwtTokenSecret'));

                            res.render('index', {
                                title: newCollection,
                                lastSync: JSON.stringify(result[1]), //second document of the 2 inserted
                                token: token
                            });
                        } else {
                            res.render('login', {errorMessage: 'An error occured. Please try again.'});
                        }
                    });
                });
            }
        });
    }
});

//upon delete collection, delete collection and render login page
router.post('/delete', jwtAuth, function(req, res) {
    var db = req.db;
    var requestedCollection = req.inventoryName;
    db.collection(requestedCollection).drop(function(err, collection) {
        if (err) {
            res.render('login', {errorMessage: 'Delete Database failed. Please try again.'});
        } else {
            res.render('login', {errorMessage: requestedCollection + ' was successfully deleted.'});
        }
    });
});


module.exports = router;
