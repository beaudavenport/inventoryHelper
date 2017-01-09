import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/app';
import db from '../../src/dbNew';
import { getSessionStorageObject } from './testUtils';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('login', () => {

  before((done) => {
    db.get(COLLECTION_NAME).drop()
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  it('renders login page', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if(err) {
          assert.fail('error displaying login:', err);
        }
        done();
      });
  });

  it('creates new collection', (done) => {
    request(app)
      .post('/create')
      .type('form')
      .send({newName: COLLECTION_NAME, newPassword: COLLECTION_PASSWORD})
      .expect(200)
      .end((err) => {
        if(err) {
          assert.fail('error creating collection:', err);
        }
        db.get(COLLECTION_NAME).count().then(result => {
          assert.strictEqual(result, 2, 'collection created with initial util and sync documents');
          done();
        });
      });
  });

  it('logs in existing collection', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({name: COLLECTION_NAME, password: COLLECTION_PASSWORD})
      .expect(200)
      .end((err, response) => {
        if(err) {
          assert.fail('error displaying homepage:', err);
        }
        assert(response.text.match(/Potato/), 'set title on response object to collection name');
        const { token, payload } = getSessionStorageObject(response.text);
        const expectedPayload = JSON.stringify({
          coffees: [],
          blends: [],
          containers: [],
          lastSync: 'never'
        });
        assert.strictEqual(expectedPayload, payload, 'JSON payload strings match');
        assert.notEqual(token, 'undefined', 'token string set');
        done();
      });
  });

  it('prevents login for bad password', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({name: COLLECTION_NAME, password: 'badpotatoes'})
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
