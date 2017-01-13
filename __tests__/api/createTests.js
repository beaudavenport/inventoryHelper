import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/app';
import db from '../../src/dbNew';
import { getSessionStorageObject } from './testUtils';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('create', () => {
  before((done) => {
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
      .post('/create')
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
      .post('/create')
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
