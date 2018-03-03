import express from 'express';
import jwtAuth from '../jwtauth.js';

import { getTokenFromLogin, createHashedPassword, createToken } from '../authorization';

const router = express.Router();

//basic regex strip special characters function (no whitespace allowed here)
function stripSpecialChars(original) {
  return original.replace(/[^\w]/gi, '');
}

router.get('(/)?*', (req, res) => {
  res.render('v2Index', {
    title: 'New Collection'
  });
});

router.post('/login', (req, res) => {
  const db = req.db;
  const { name, password } = req.body;
  const userCollection = stripSpecialChars(name);

  let getCollectionUtility = db.get(userCollection).findOne({'util':'util'})
    .then(utility => {
      if(utility === null) {
        res.status(404).json({error: 'Collection does not exist or there\'s an error.'});
      }
      return utility;
    });

  getCollectionUtility.then(utility => {
    return getTokenFromLogin(userCollection, password, utility.pass);
  })
  .then(token => {
    res.json({title: userCollection, token});
  })
  .catch((err) => {
    res.status(401).json({ error: 'Invalid password.' });
  });
});

router.post('/create', (req, res) => {
  const db = req.db;
  const { newName, newPassword } = req.body;
  const newCollectionName = stripSpecialChars(newName);

  //Password must contain at least 8 characters including a capital letter,
  //a number, a special character, and cannot have harmful characters.
  const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%?&][^\s{}<>#*,;()|]{8,}/;

  if (!passReg.test(newPassword)) {
    res.status(401).json({error: 'Invalid password.'});
  } else {
    //{strict:true} prevents duplicate collection creation.
    let newCollection = db.create(newCollectionName, {strict: true});
    return newCollection.findOne({'util':'util'})
      .then(utility => {
        if(utility != null) {
          res.status(401).json({error: 'Collection already exists.'});
        }
      })
      .then(() => createHashedPassword(newPassword))
      .then(hashedPassword => {
        return newCollection.insert([
              {'util' : 'util', 'pass' : hashedPassword},
              {metadata : true, 'lastSync' : 'never', collectionName: newCollectionName}
        ], {safe:true})
        .then(() => {
          res.json({
            title: newCollectionName,
            token: createToken(newCollectionName)
          });
        });
      })
      .catch((err) => {
        res.status(401).json({error: 'An error occurred.'});
      });
  }
});

module.exports = router;
