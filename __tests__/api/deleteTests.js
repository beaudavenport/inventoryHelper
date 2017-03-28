import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/app';
import db from '../../src/db';
import { getSessionStorageObject } from './testUtils';
import { createToken } from '../../src/authorization';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('delete', () => {
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

  it('does not delete if auth token is invalid', (done) => {
    db.get(COLLECTION_NAME).insert([{category: 'blend'}, {category: 'coffee'}, {category: 'container'}])
      .then(() => {
        request(app)
          .post('/delete')
          .type('form')
          .send({access_token: createToken('beans')})
          .expect(404)
          .end((err, response) => {
            if(err) {
              assert.fail('error deleting record: ', err);
            }
            assert(response.text.match(/Delete\sDatabase\sfailed\.\sPlease\stry\sagain\./), 'rendered error');
            done();
          });
      });
  });

  it('does not delete if collection does not exist', () => {
    return db.get(COLLECTION_NAME).insert([{category: 'blend'}, {category: 'coffee'}, {category: 'container'}])
      .then(() => {
        request(app)
          .delete('/login')
          .type('form')
          .send({inventoryName: 'thingsUntrue', access_token: token})
          .expect(404)
          .end((err, response) => {
            if(err) {
              assert.fail('error deleting record: ', err);
            }
            assert(response.text.match(/Delete\sDatabase\sfailed\.\sPlease\stry\sagain\./), 'rendered error');
          });
      });
  });

  it('deletes successfully if auth token is valid', (done) => {
    db.get(COLLECTION_NAME).insert([{category: 'blend'}, {category: 'coffee'}, {category: 'container'}])
      .then(() => {
        request(app)
          .post('/delete')
          .type('form')
          .send({access_token: token})
          .expect(200)
          .end((err, response) => {
            if(err) {
              assert.fail('error deleting record: ', err);
            }
            assert(response.text.match(/Potato\swas\ssuccessfully\sdeleted\./), 'rendered success message');
            done();
          });
      });
  });
});
