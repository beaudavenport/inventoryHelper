/*
* Inventory Route provides the RESTful API for database access.
* It is protected by a JWT authentication middleware file.
*/
import express from 'express';
import jwtAuth from '../jwtauth.js';
import moment from 'moment';

const router = express.Router();

//any API call must pass JWT authentication
router.all('/*', jwtAuth);

//get requests with 'type' specified filter results by category, returning a sub-collection

router.get('/:type', (req, res) => {
  const type = req.params.type;
  const db = req.dbNew;
  const inventoryName = req.inventoryName;

  db.get(inventoryName).find({type})
    .then(resultSet => {
      res.json(resultSet);
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//get requests with an id specified return a single result by ObjectID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const db = req.dbNew;
  const inventoryName = req.inventoryName;

  db.get(inventoryName).findOne({_id: id})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//post requests have a 'category' field specified client-side for later retrieval by category
router.post('/', (req, res) => {
  const newItem = req.body;
  const db = req.dbNew;
  const inventoryName = req.inventoryName;

  db.get(inventoryName).insert(newItem, {safe: true})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//put requests update a single result by ObjectID
router.put('/:id', (req, res) => {
  const update = req.body;
  const id = req.params.id;
  const db = req.dbNew;
  const inventoryName = req.inventoryName;
  const inventory = db.get(inventoryName);

  inventory.update({_id: id}, update)
    .then(() => {
      return inventory.findOne({_id: id})
        .then(result => {
          res.json(result);
        });
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//delete single result by ObjectID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const db = req.dbNew;
  const inventoryName = req.inventoryName;

  db.collection(inventoryName).remove({_id: id})
    .then(() => {
      res.json({_id: id});
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//update time of last 'Sync to database' event
router.put('/sync/:id', (req, res) => {
  const db = req.dbNew;
  const inventoryName = req.inventoryName;
  const inventory = db.get(inventoryName);

  inventory.update({'date': 'date'}, {'date':'date', 'lastSync': moment.utc().toJSON()}, {safe: true})
    .then(() => {
      return inventory.findOne({'date': 'date'})
        .then(result => {
          res.json(result);
        });
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

module.exports = router;
