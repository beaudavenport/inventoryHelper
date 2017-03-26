import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/app';
import db from '../../src/dbNew';
import { getSessionStorageObject } from './testUtils';
import { createToken } from '../../src/authorization';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('inventory', () => {
  let token;

  beforeEach((done) => {
    db.get(COLLECTION_NAME).drop()
      .then(() => {
        request(app)
          .post('/create')
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
    const record = {type, stuff: 'stuff'};
    const record2 = {type, thing: 'potato'};
    const record3 = {type: 'not right', item: 'who cares'};

    db.get(COLLECTION_NAME).insert([record, record2, record3]);
    return request(app)
      .get(`/inventory/${type}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert.strictEqual(response.body.length, 2);
        assert.deepEqual(response.body[0].stuff, record.stuff);
        assert.deepEqual(response.body[1].thing, record2.thing);
      })
      .catch((err) => {
        assert.fail('Error fetching inventory: ', err);
      });
  });
});
