import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import isomorphicFetch from 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import lastSync, { sync } from '../../../src/client/reducers/lastSync';

describe('lastSync reducer', () => {
  let getStateStub;
  let dispatchStub;
  const syncUpdate = { syncUpdate: 'syncUpdate'};

  function getFetchMockCallInfo(mockCall) {
    return {
      url: mockCall[0],
      tokenHeader: mockCall[1].headers['x-access-token'],
      body: mockCall[1].body
    };
  }

  beforeEach(() => {
    fetchMock.put('express:/inventory/:id', {});
    fetchMock.put('express:/inventory/sync/:id', syncUpdate);
    getStateStub = sinon.stub();
    dispatchStub = sinon.stub();
    global.sessionStorage = {
      getItem: sinon.stub().withArgs('token').returns('tokenString')
    };
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('sync', () => {
    it('should call to PUT all updated coffees', () => {
      const coffee1 = {_id: 78, thing: 'thing'};
      const coffee2 =  {_id: 90, otherThing: 'better thing'};
      getStateStub.returns({
        singleOriginCoffees: [coffee1, coffee2],
        lastSync: {_id: 8}
      });

      return sync()(dispatchStub, getStateStub)
        .then(() => {
          const coffeePut1 = getFetchMockCallInfo(fetchMock.calls().matched[0]);
          const coffeePut2 =  getFetchMockCallInfo(fetchMock.calls().matched[1]);
          const syncPut =  getFetchMockCallInfo(fetchMock.calls().matched[2]);

          assert.strictEqual(coffeePut1.url, '/inventory/78')
          assert.strictEqual(coffeePut1.tokenHeader, 'tokenString');
          assert.deepEqual(coffeePut1.body, JSON.stringify(coffee1));

          assert.strictEqual(coffeePut2.url, '/inventory/90');
          assert.strictEqual(coffeePut2.tokenHeader, 'tokenString');
          assert.deepEqual(coffeePut2.body, JSON.stringify(coffee2));

          assert.strictEqual(syncPut.url, '/inventory/sync/8');
          assert.strictEqual(syncPut.tokenHeader, 'tokenString');

          assert.deepEqual(dispatchStub.args[0][0], {type: 'SAVE_SUCCESSFUL', payload: syncUpdate});
        });
    });
  });
});
