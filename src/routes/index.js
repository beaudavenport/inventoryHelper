import express from 'express';
import moment from 'moment';
import jwt from 'jwt-simple';
import jwtAuth from '../jwtauth.js';
import bcrypt from 'bcrypt-nodejs';

import { getTokenFromLogin, createHashedPassword, createToken } from '../authorization';

let router = express.Router();

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
  const { name, password } = req.body;
  const userCollection = stripSpecialChars(name);

  let getCollectionUtility = db.get(userCollection).findOne({'util':'util'})
    .then(utility => utility)
    .catch(function() {
      res.render('login', {errorMessage: 'Database doesn\'t exist or there\'s an error'});
    });

  let getToken = getCollectionUtility.then(utility => {
    return getTokenFromLogin(userCollection, password, utility.pass);
  });

  getToken.then(token => {
    db.get(userCollection).find({category: { $in: ['coffee', 'blend', 'container']}})
      .then(resultSet => {
        let payload = {
          coffees: resultSet.filter(result => result.category === 'coffee'),
          blends: resultSet.filter(result => result.category === 'blend'),
          containers: resultSet.filter(result => result.category === 'container'),
          lastSync: 'never'
        };
        res.render('index', {
          title: userCollection,
          payload: JSON.stringify(payload),
          token
        });
      });
  })
  .catch(() => {
    res.status(401).render('login', {errorMessage: 'Invalid password.'});
  });
});

// upon create, set up new collection, then render page
router.post('/create', (req, res) => {
  const db = req.dbNew;
  const { newName, newPassword, isHuman } = req.body;
  const newCollectionName = stripSpecialChars(newName);

  //Password must contain at least 8 characters including a capital letter,
  //a number, a special character, and cannot have harmful characters.
  const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%?&][^\s{}<>#*,;()|]{8,}/;

  // a hidden form field is used to protect against bots. "notHuman" is changed to "human" client-side.
  if (isHuman === 'notHuman') {
    res.status(401).render('login', {errorMessage: 'Humans only please.'});
  } else if (!passReg.test(newPassword)) {
    res.status(401).render('login', {errorMessage: 'Invalid password.'});
  } else {
    //{strict:true} prevents duplicate collection creation.
    let newCollection = db.create(newCollectionName, {strict: true});
    return newCollection.find()
      .then(() => createHashedPassword(newPassword))
      .then(hashedPassword => {
        return newCollection.insert(
          [
                  {'util' : 'util', 'pass' : hashedPassword},
                  {'date' : 'date', 'lastSync' : 'never'}
          ], {safe:true})
          .then(() => {
            res.render('index', {
              title: newCollectionName,
              payload: JSON.stringify({coffees: [], blends: [], containers: [], lastSync: 'never' }),
              token: createToken(hashedPassword)
            });
          });
      })
      .catch((error) => {
        console.error(error);
        res.render('login', {errorMessage: 'Database already exists or is unavailable'});
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
