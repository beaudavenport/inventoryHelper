import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/api/app';
import db from '../../src/api/db';
import { getSessionStorageObject } from './testUtils';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('create', () => {
  beforeEach((done) => {
    db.get(COLLECTION_NAME).drop()
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  it('prevents login for bots', (done) => {
    request(app)
      .post('/v1/create')
      .type('form')
      .send({isHuman: 'notHuman', newName: ''})
      .expect(401)
      .end((err, response) => {
        if(err) {
          assert.fail('error displaying login:', err);
        }
        assert(response.text.match(/Humans\sonly\splease\./), 'displays invalid bot authentication error');
        assert.deepEqual({}, getSessionStorageObject(response.text), 'session storage payload not set');
        done();
      });
  });

  it('prevents login for bad password', (done) => {
    request(app)
      .post('/v1/create')
      .type('form')
      .send({isHuman: 'isHuman', newName: '', newPassword: 'potato'})
      .expect(401)
      .end((err, response) => {
        if(err) {
          assert.fail('error displaying login:', err);
        }
        assert(response.text.match(/Invalid\spassword\./), 'displays invalid password error');
        assert.deepEqual({}, getSessionStorageObject(response.text), 'session storage payload not set');
        done();
      });
  });

  it('prevents login if database exists', (done) => {
    db.create(COLLECTION_NAME, {strict: true}).find()
      .then(() => {
        request(app)
          .post('/v1/create')
          .type('form')
          .send({isHuman: 'isHuman', newName: '', newPassword: 'potato'})
          .expect(401)
          .end((err, response) => {
            if(err) {
              assert.fail('error displaying login:', err);
            }
            assert(response.text.match(/Invalid\spassword\./), 'displays invalid password error');
            assert.deepEqual({}, getSessionStorageObject(response.text), 'session storage payload not set');
            done();
          });
      });
  });

  it('renders newly created collection and bootstraps jwt token', (done) => {
    request(app)
      .post('/v1/create')
      .type('form')
      .send({isHuman: 'isHuman', newName: COLLECTION_NAME, newPassword: COLLECTION_PASSWORD})
      .expect(200)
      .end((err, response) => {
        if(err) {
          assert.fail('error displaying homepage:', err);
        }
        assert(response.text.match(/Potato/), 'set title on response object to collection name');
        const { payload, token } = getSessionStorageObject(response.text);
        const { coffees, blends, containers, lastSync } = JSON.parse(payload);
        assert.strictEqual(0, coffees.length, 'coffee record returned');
        assert.strictEqual(0, blends.length, 'coffee record returned');
        assert.strictEqual(0, containers.length, 'coffee record returned');
        assert.strictEqual('never', lastSync.lastSync);
        assert.ok(lastSync._id);
        assert.notEqual(token, 'undefined', 'token string set');
        done();
      });
  });
});
