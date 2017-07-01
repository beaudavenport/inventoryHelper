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

router.get('/', (req, res) => {
  const db = req.db;
  const inventoryName = req.inventoryName;

  db.get(inventoryName).find({ $or: [ {category: { $in: ['coffee', 'blend', 'container']}}, { 'date': 'date'} ] })
    .then(resultSet => {
      let payload = {
        coffees: resultSet.filter(result => result.category === 'coffee'),
        blends: resultSet.filter(result => result.category === 'blend'),
        containers: resultSet.filter(result => result.category === 'container'),
        lastSync: resultSet.find(result => result.date === 'date')
      };
      res.json(payload);
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//get requests with an id specified return a single result by ObjectID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const db = req.db;
  const inventoryName = req.inventoryName;

  db.get(inventoryName).findOne({$and: [{_id: id}, { 'util': { $not: { $eq: 'util' } } }] })
    .then(result => {
      if(!result) {
        res.status(404).json({error: 'record does not exist'});
      }
      res.json(result);
    })
    .catch(err => {
      res.status(404).json({error: err});
    });
});

//post requests have a 'category' field specified client-side for later retrieval by category
router.post('/', (req, res) => {
  const newItem = req.body;
  const db = req.db;
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
  const db = req.db;
  const inventoryName = req.inventoryName;
  const inventory = db.get(inventoryName);
  return inventory.findOne({$and: [{_id: id}, { 'util': { $not: { $eq: 'util' } } }] })
    .then(result => {
      if(!result) {
        throw new Error('record does not exist');
      }
    })
    .then(() => inventory.update({_id: id}, update))
    .then(() => inventory.findOne({_id: id}))
    .then(result => res.json(result))
    .catch(err => res.status(404).json({error: err.message}));
});

//delete single result by ObjectID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const db = req.db;
  const inventoryName = req.inventoryName;
  const inventory = db.get(inventoryName);
  return inventory.findOne({$and: [{_id: id}, { 'util': { $not: { $eq: 'util' } } }] })
    .then(result => {
      if(!result) {
        throw new Error('record does not exist');
      }
      return result;
    })
    .then(result => inventory.remove(result))
    .then(() => res.json({_id: id}))
    .catch(err => {
      res.status(404).json({error: err.message});
    });
});

//update time of last 'Sync to database' event
router.put('/sync/:id', (req, res) => {
  const db = req.db;
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
