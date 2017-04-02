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

  beforeEach((done) => {
    db.get(COLLECTION_NAME).drop()
      .then(() => {
        request(app)
          .post('/v1/create')
          .type('form')
          .send({isHuman: 'isHuman', newName: COLLECTION_NAME, newPassword: COLLECTION_PASSWORD})
          .end((err, response) => {
            if(err) {
              assert.fail('error displaying homepage:', err);
            }
            token = getSessionStorageObject(response.text).token;
            done();
          });
      });
  });

  it('GET with type returns all items with specific type', () => {
    const type = 'Guacamole';
    const record1 = {type, stuff: 'stuff'};
    const record2 = {type, thing: 'potato'};
    const record3 = {type: 'not right', item: 'who cares'};

    db.get(COLLECTION_NAME).insert([record1, record2, record3])
      .then(() => {
        return request(app)
          .get(`/inventory/${type}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            assert.strictEqual(response.body.length, 2);
            assert.strictEqual(response.body[0].stuff, record1.stuff);
            assert.strictEqual(response.body[1].thing, record2.thing);
          })
          .catch((err) => {
            assert.fail('Error fetching inventory: ', err);
          });
      });
  });

  it('GET with id returns specific item by _id', () => {
    const record1 = {stuff: 'stuff'};
    const record2 = {stuff: 'bad stuff'};

    db.get(COLLECTION_NAME).insert([record1, record2])
      .then(() => {
        return request(app)
          .get(`/inventory/${record1._id}`)
          .set('x-access-token', token)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            assert.strictEqual(response.body.stuff, record1.stuff);
          })
          .catch((err) => {
            assert.fail('Error fetching inventory: ', err);
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
      })
      .catch((err) => {
        assert.fail('Error fetching inventory: ', err);
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
          .send({thing: 'NEW information'})
          .set('x-access-token', token)
          .set('Accept', 'application/json')
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
      })
      .catch((err) => {
        assert.fail('Error fetching inventory: ', err);
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
          })
          .catch((err) => {
            assert.fail('Error fetching inventory: ', err);
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
      })
      .catch((err) => {
        assert.fail('Error fetching inventory: ', err);
      });
  });
});
