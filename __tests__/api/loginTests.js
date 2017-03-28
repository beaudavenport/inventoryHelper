import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/app';
import db from '../../src/db';
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

  it('logs in existing collection and bootstraps jwt token', (done) => {
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

  it('includes payload for existing collection', (done) => {
    db.get(COLLECTION_NAME).insert([{category: 'blend'}, {category: 'coffee'}, {category: 'container'}])
    .then(() => {
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
          const { payload } = getSessionStorageObject(response.text);
          const { coffees, blends, containers } = JSON.parse(payload);
          assert.strictEqual(1, coffees.length, 'coffee record returned');
          assert.strictEqual(1, blends.length, 'coffee record returned');
          assert.strictEqual(1, containers.length, 'coffee record returned');
          done();
        });
    })
    .catch(() => {
      assert.fail('error loading test data.');
      done();
    });
  });
});
