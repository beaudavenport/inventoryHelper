import mocha from 'mocha';
import assert from 'assert';
import sinon from 'sinon';
import isomorphicFetch from 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import metadata, { sync } from '../../../src/client/reducers/metadata';

describe('metadata', () => {
  describe('actions', () => {
    let getStateStub;
    let dispatchStub;
    const metadataUpdate = { metadataUpdate: 'metadataUpdate'};

    function getFetchMockCallInfo(mockCall) {
      return {
        url: mockCall[0],
        tokenHeader: mockCall[1].headers['x-access-token'],
        body: mockCall[1].body
      };
    }

    beforeEach(() => {
      fetchMock.put('express:/inventory/:id', {});
      fetchMock.post('express:/inventory', {});
      fetchMock.delete('express:/inventory/:id', {});
      fetchMock.put('express:/inventory/sync/:id', metadataUpdate);
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
      it('should call to ADD all new coffees', () => {
        const coffee1 = {_id: 78, thing: 'thing', isNew: true, isDirty: true};
        const expectedCoffee1Body = JSON.stringify({thing: 'thing'});
        const coffee2 =  {_id: 90, otherThing: 'better thing', isNew: true};
        const expectedCoffee2Body = JSON.stringify({otherThing: 'better thing'});

        getStateStub.returns({
          inventory: [coffee1, coffee2],
          metadata: {_id: 8}
        });

        return sync()(dispatchStub, getStateStub)
          .then(() => {
            const coffeePost1 = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const coffeePost2 =  getFetchMockCallInfo(fetchMock.calls().matched[1]);
            const syncPut =  getFetchMockCallInfo(fetchMock.calls().matched[2]);

            assert.strictEqual(coffeePost1.url, '/inventory');
            assert.strictEqual(coffeePost1.tokenHeader, 'tokenString');
            assert.deepEqual(coffeePost1.body, expectedCoffee1Body);

            assert.strictEqual(coffeePost2.url, '/inventory');
            assert.strictEqual(coffeePost2.tokenHeader, 'tokenString');
            assert.deepEqual(coffeePost2.body, expectedCoffee2Body);

            assert.strictEqual(syncPut.url, '/inventory/sync/8');
            assert.strictEqual(syncPut.tokenHeader, 'tokenString');

            assert.deepEqual(dispatchStub.args[0][0], {type: 'UPDATE_METADATA', payload: metadataUpdate});
          });
      });

      it('should call to PUT all updated coffees', () => {
        const coffee1 = {_id: 78, thing: 'thing', isDirty: true};
        const expectedCoffee1Body = JSON.stringify({_id: 78, thing: 'thing'});
        const coffee2 =  {_id: 90, otherThing: 'better thing', isDirty: true};
        const expectedCoffee2Body = JSON.stringify({_id: 90, otherThing: 'better thing'});

        getStateStub.returns({
          inventory: [coffee1, coffee2],
          metadata: {_id: 8}
        });

        return sync()(dispatchStub, getStateStub)
          .then(() => {
            const coffeePut1 = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const coffeePut2 =  getFetchMockCallInfo(fetchMock.calls().matched[1]);
            const syncPut =  getFetchMockCallInfo(fetchMock.calls().matched[2]);

            assert.strictEqual(coffeePut1.url, '/inventory/78');
            assert.strictEqual(coffeePut1.tokenHeader, 'tokenString');
            assert.deepEqual(coffeePut1.body, expectedCoffee1Body);

            assert.strictEqual(coffeePut2.url, '/inventory/90');
            assert.strictEqual(coffeePut2.tokenHeader, 'tokenString');
            assert.deepEqual(coffeePut2.body, expectedCoffee2Body);

            assert.strictEqual(syncPut.url, '/inventory/sync/8');
            assert.strictEqual(syncPut.tokenHeader, 'tokenString');

            assert.deepEqual(dispatchStub.args[0][0], {type: 'UPDATE_METADATA', payload: metadataUpdate});
          });
      });

      it('should call to DELETE all coffees flagged for deletion', () => {
        const coffee1 = {_id: 1111, thing: 'ooooo', isDeleted: true};
        const coffee2 =  {_id: 90, otherThing: 'not dead yet!'};

        getStateStub.returns({
          inventory: [coffee1, coffee2],
          metadata: {_id: 6666}
        });

        return sync()(dispatchStub, getStateStub)
          .then(() => {
            assert.strictEqual(fetchMock.calls().matched.length, 2);

            const coffeeDelete = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const syncPut =  getFetchMockCallInfo(fetchMock.calls().matched[1]);

            assert.strictEqual(coffeeDelete.url, '/inventory/1111');
            assert.strictEqual(coffeeDelete.tokenHeader, 'tokenString');

            assert.strictEqual(syncPut.url, '/inventory/sync/6666');
            assert.strictEqual(syncPut.tokenHeader, 'tokenString');

            assert.deepEqual(dispatchStub.args[0][0], {type: 'UPDATE_METADATA', payload: metadataUpdate});
          });
      });

      it('should not call to PUT coffees that are not updated or are new', () => {
        const coffee1 = {_id: 78, thing: 'thing'};
        const coffee2 =  {_id: 90, otherThing: 'better thing', isDirty: true};
        const coffee3 =  {_id: 45, otherThing: 'better thing', isDirty: true, isNew: true};

        getStateStub.returns({
          inventory: [coffee1, coffee2, coffee3],
          metadata: {_id: 8}
        });

        return sync()(dispatchStub, getStateStub)
          .then(() => {
            assert.strictEqual(fetchMock.calls().matched.length, 3);

            const coffeePost = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const coffeePut1 = getFetchMockCallInfo(fetchMock.calls().matched[1]);
            const syncPut =  getFetchMockCallInfo(fetchMock.calls().matched[2]);

            assert.strictEqual(coffeePost.url, '/inventory');
            assert.strictEqual(coffeePut1.url, '/inventory/90');
            assert.strictEqual(syncPut.url, '/inventory/sync/8');
            assert.deepEqual(dispatchStub.args[0][0], {type: 'UPDATE_METADATA', payload: metadataUpdate});
          });
      });
    });
  });

  describe('reducer', () => {
    describe('UPDATE_METADATA', () => {
      it('should return updated metadata', () => {
        const oldSync = {thing: 'old', cruft: 'stuff'};
        const newSync = {thing: 'updated'};
        const action = {type: 'UPDATE_METADATA', payload: newSync};

        assert.deepEqual(metadata(oldSync, action), newSync);
      });
    });

    describe('RESET_ALL_INVENTORY_ITEMS', () => {
      it('should reset metatdata item', () => {
        const oldSync = {thing: 'old', cruft: 'stuff'};
        const action = {type: 'RESET_ALL_INVENTORY_ITEMS'};

        assert.deepEqual(metadata(oldSync, action), {});
      });
    });
  });
});
