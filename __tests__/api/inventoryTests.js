import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/api/app';
import db from '../../src/api/db';
import { getSessionStorageObject } from './testUtils';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('inventory', () => {
  let token;

  beforeEach(() => {
    return db.get(COLLECTION_NAME).drop()
      .then(() => {
        return request(app)
          .post('/v1/create')
          .type('form')
          .send({isHuman: 'isHuman', newName: COLLECTION_NAME, newPassword: COLLECTION_PASSWORD})
          .expect(200)
          .then((response) => {
            token = getSessionStorageObject(response.text).token;
          });
      });
  });

  it('GET with no parameters returns all inventory data', () => {
    const coffeeData = [{category: 'coffee'}, {category: 'coffee', stuff: 'ooo!'}];
    const blendData = [{category: 'blend', stuff: 'thing'}, {category: 'blend', stuff: 'other'}];
    const containerData = [{category: 'container', stuff: 1}, {category: 'container'}];
    const badRecord = {stuff: 'bad stuff'};
    const allRecords = [...coffeeData, ...blendData, ...containerData, badRecord];
    return db.get(COLLECTION_NAME).insert(allRecords)
      .then(() => {
        return request(app)
          .get('/v2/inventory')
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            const { coffees, blends, containers, metadata } = response.body;
            assert.strictEqual(coffees.length, 2);
            assert.strictEqual(blends.length, 2);
            assert.strictEqual(containers.length, 2);
            assert.strictEqual(metadata.lastSync, 'never');
            assert.strictEqual(metadata.collectionName, COLLECTION_NAME);
          });
      });
  });

  it('GET with id returns specific item by _id', () => {
    const record1 = {stuff: 'stuff'};
    const record2 = {stuff: 'bad stuff'};

    return db.get(COLLECTION_NAME).insert([record1, record2])
      .then(() => {
        return request(app)
          .get(`/v2/inventory/${record1._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            assert.strictEqual(response.body.stuff, record1.stuff);
          });
      });
  });

  it('GET with id for utility record returns 404', () => {
    const record1 = {'util': 'util', stuff: 'stuff'};

    return db.get(COLLECTION_NAME).insert([record1])
      .then(() => {
        return request(app)
          .get(`/v2/inventory/${record1._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response) => {
            assert.deepEqual(response.body, {error: 'record does not exist'});
          });
      });
  });

  it('POST adds new inventory item and returns', () => {
    const newItem = {
      type: 'Cucumber',
      thing: 'Great information'
    };

    return request(app)
      .post('/v2/inventory')
      .send(newItem)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        assert.strictEqual(response.body.type, newItem.type);
        assert.strictEqual(response.body.thing, newItem.thing);
        return response.body._id;
      })
      .then((itemId) => {
        return db.get(COLLECTION_NAME).findOne({_id: itemId})
          .then((result) => {
            assert.strictEqual(result.type, newItem.type);
            assert.strictEqual(result.thing, newItem.thing);
          });
      });
  });

  it('PUT updates item and returns', () => {
    const itemToUpdate = {
      type: 'Cucumber',
      thing: 'OLD information'
    };
    return db.get(COLLECTION_NAME).insert(itemToUpdate)
      .then(() => {
        return request(app)
          .put(`/v2/inventory/${itemToUpdate._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .send({thing: 'NEW information'})
          .expect(200)
          .then((response) => {
            assert.strictEqual(response.body.thing, 'NEW information');
            return response.body._id;
          })
          .then((itemId) => {
            return db.get(COLLECTION_NAME).findOne({_id: itemId})
              .then((result) => {
                assert.strictEqual(result.thing, 'NEW information');
              });
          });
      });
  });

  it('PUT for utility record returns 404', () => {
    const itemToUpdate = {
      type: 'Cucumber',
      'util': 'util',
      thing: 'OLD information'
    };
    return db.get(COLLECTION_NAME).insert(itemToUpdate)
      .then(() => {
        return request(app)
          .put(`/v2/inventory/${itemToUpdate._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .send({thing: 'NEW information'})
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response) => {
            assert.deepEqual(response.body, {error: 'record does not exist'});
          })
          .then(() => {
            return db.get(COLLECTION_NAME).findOne({_id: itemToUpdate._id})
              .then((result) => {
                assert.strictEqual(result.thing, 'OLD information');
              });
          });
      });
  });


  it('DELETE with id deletes item by _id', () => {
    const record = {stuff: 'stuff'};

    return db.get(COLLECTION_NAME).insert(record)
      .then(() => {
        return request(app)
          .delete(`/v2/inventory/${record._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            assert.equal(response.body._id, record._id);
          })
          .then(() => {
            return db.get(COLLECTION_NAME).findOne({_id: record._id})
              .then((result) => {
                assert.strictEqual(result, null);
              });
          });
      });
  });

  it('DELETE for utility record returns 404', () => {
    const itemToDelete = {
      type: 'Acorn Squash',
      'util': 'util',
      thing: 'OLD information'
    };
    return db.get(COLLECTION_NAME).insert(itemToDelete)
      .then(() => {
        return request(app)
          .delete(`/v2/inventory/${itemToDelete._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response) => {
            assert.deepEqual(response.body, {error: 'record does not exist'});
          })
          .then(() => {
            return db.get(COLLECTION_NAME).findOne({_id: itemToDelete._id})
              .then((result) => {
                assert.strictEqual(result.thing, 'OLD information');
              });
          });
      });
  });

  it('PUT SYNC updates item and returns', () => {
    return db.get(COLLECTION_NAME).insert({metadata: true})
      .then(() => {
        return request(app)
          .put('/v2/inventory/sync/foo')
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect(200)
          .then((response) => {
            assert.ok(response.body.metadata);
            assert.notEqual(response.body.lastSync, 'never');
            assert.strictEqual(response.body.collectionName, COLLECTION_NAME);
          });
      });
  });
});
