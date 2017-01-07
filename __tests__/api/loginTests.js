import mocha from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../../app';
import db from '../../dbNew';

describe('login', () => {
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
      .send({newName: 'potato', newPassword: 'Testw@rd1'})
      .expect(200)
      .end((err, res) => {
        db.get('potato').count().then(result => {
          assert.strictEqual(result, 2, 'collection created with initial util and sync documents');
          done();
        });
      });
  });

  it('logs in existing collection', (done) => {
    request(app)
      .post('/login')
      .type('form')
      .send({name: 'potato', password: 'Testw@rd1'})
      .expect(200)
      .end((err, res) => {
        if(err) {
          assert.fail('error displaying homepage:', err);
        }
        console.log('response: ', res);
        done();
      });
  });
});
