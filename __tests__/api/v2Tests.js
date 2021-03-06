import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../src/api/app';
import db from '../../src/api/db';

const COLLECTION_NAME = 'Potato';
const COLLECTION_PASSWORD = 'Testw@rd1';

describe('v2 endpoints', () => {
  beforeEach((done) => {
    db.get('NEWNAME').drop()
      .then(() => db.get(COLLECTION_NAME).drop())
      .then(() => {
        request(app)
          .post('/v1/create')
          .type('form')
          .send({isHuman: 'isHuman', newName: COLLECTION_NAME, newPassword: COLLECTION_PASSWORD})
          .end((err) => {
            if(err) {
              assert.fail('error displaying homepage:', err);
            }
            done();
          });
      });
  });

  describe('GET home', () => {
    it('renders app when v2 is specified', (done) => {
      request(app)
        .get('/v2')
        .expect(200)
        .end((err) => {
          if(err) {
            assert.fail('error displaying application:', err);
          }
          done();
        });
    });

    it('renders default app regardless of sub routes in url', (done) => {
      request(app)
        .get('/v2/potato/potato15')
        .expect(200)
        .end((err) => {
          if(err) {
            assert.fail('error displaying application:', err);
          }
          done();
        });
    });

    it('renders v2 version of app as default', (done) => {
      request(app)
        .get('/')
        .expect(302)
        .end((err, res) => {
          if(err) {
            assert.fail('error displaying application:', err);
          }
          assert(res.header['location'].endsWith('/v2'));
          done();
        });
    });
  });

  describe('POST login', () => {
    it('logs in existing collection and returns jwt token', (done) => {
      request(app)
        .post('/v2/login')
        .set('Accept', 'application/json')
        .send({name: COLLECTION_NAME, password: COLLECTION_PASSWORD})
        .expect(200)
        .end((err, response) => {
          if(err) {
            assert.fail('error logging in:', err);
          }
          const { token, title } = response.body;
          assert.notEqual(token, 'undefined', 'token string set');
          assert.strictEqual(title, COLLECTION_NAME, 'returned name');
          done();
        });
    });

    it('prevents login for bad password', (done) => {
      request(app)
        .post('/v2/login')
        .set('Accept', 'application/json')
        .send({name: COLLECTION_NAME, password: 'badpotatoes'})
        .expect(401)
        .end((err, response) => {
          if(err) {
            assert.fail('error displaying login:', err);
          }
          assert.deepEqual(response.body, { error: 'Invalid password.'}, 'displays invalid password error');
          done();
        });
    });

    it('prevents login for non-existent collection', (done) => {
      request(app)
        .post('/v2/login')
        .set('Accept', 'application/json')
        .send({name: 'Bad Stuff', password: COLLECTION_PASSWORD})
        .expect(404)
        .end((err, response) => {
          if(err) {
            assert.fail('error displaying login:', err);
          }
          assert.deepEqual(response.body, { error: 'Collection does not exist or there\'s an error.'}, 'displays invalid collection error');
          done();
        });
    });
  });

  describe('POST create', () => {
    it('prevents creation for bad password', (done) => {
      request(app)
        .post('/v2/create')
        .set('Accept', 'application/json')
        .send({isHuman: 'isHuman', newName: '', newPassword: 'potato'})
        .expect(401)
        .end((err, response) => {
          if(err) {
            assert.fail('error displaying login:', err);
          }
          assert.deepEqual(response.body, { error: 'Invalid password.'}, 'displays password error');
          done();
        });
    });

    it('prevents creation if database exists', (done) => {
      request(app)
        .post('/v2/create')
        .set('Accept', 'application/json')
        .send({isHuman: 'isHuman', newName: COLLECTION_NAME, newPassword: COLLECTION_PASSWORD})
        .expect(401)
        .end((err, response) => {
          if(err) {
            assert.fail('error displaying login:', err);
          }
          assert.deepEqual(response.body, { error: 'Collection already exists.'}, 'displays duplicate error');
          done();
        });
    });

    it('renders newly created collection and returns jwt token', () => {
      return request(app)
        .post('/v2/create')
        .set('Accept', 'application/json')
        .send({isHuman: 'isHuman', newName: 'NEWNAME', newPassword: COLLECTION_PASSWORD})
        .expect(200)
        .then((response) => {
          const { token, title } = response.body;
          assert.notEqual(token, 'undefined', 'token string set');
          assert.strictEqual(title, 'NEWNAME', 'returned name');
        })
        .then(() => {
          return db.get(COLLECTION_NAME).findOne({metadata: true})
            .then((result) => {
              assert.strictEqual(result.lastSync, 'never');
              assert.strictEqual(result.collectionName, COLLECTION_NAME);
            });
        });
    });
  });
});
