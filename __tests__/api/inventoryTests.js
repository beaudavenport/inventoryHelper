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

  it('GET with id returns specific item by _id', () => {
    const record1 = {stuff: 'stuff'};
    const record2 = {stuff: 'bad stuff'};

    return db.get(COLLECTION_NAME).insert([record1, record2])
      .then(() => {
        return request(app)
          .get(`/inventory/${record1._id}`)
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
          .get(`/inventory/${record1._id}`)
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
      .post('/inventory')
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
          .put(`/inventory/${itemToUpdate._id}`)
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
          .put(`/inventory/${itemToUpdate._id}`)
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
          .delete(`/inventory/${record._id}`)
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

  it('PUT SYNC updates item and returns', () => {
    return db.get(COLLECTION_NAME).insert({'date':'date'})
      .then(() => {
        return request(app)
          .put('/inventory/sync/foo')
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect(200)
          .then((response) => {
            assert.ok(response.body.lastSync);
            assert.notEqual(response.body.lastSync, 'never');
          });
      });
  });
});
