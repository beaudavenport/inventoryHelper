import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/api/app';
import db from '../../src/api/db';
import { getSessionStorageObject } from './testUtils';
import { createToken } from '../../src/api/authorization';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('delete', () => {
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

  it('does not delete if auth token is invalid', (done) => {
    db.get(COLLECTION_NAME).insert([{category: 'blend'}, {category: 'coffee'}, {category: 'container'}])
      .then(() => {
        request(app)
          .post('/v1/delete')
          .set('x-access-token', createToken('beans'))
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

  it('does not delete if collection does not exist', (done) => {
    db.get(COLLECTION_NAME).drop()
      .then(() => {
        request(app)
          .post('/v1/delete')
          .set('x-access-token', token)
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

  it('deletes successfully if auth token is valid', (done) => {
    db.get(COLLECTION_NAME).insert([{category: 'blend'}, {category: 'coffee'}, {category: 'container'}])
      .then(() => {
        request(app)
          .post('/v1/delete')
          .set('x-access-token', token)
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
