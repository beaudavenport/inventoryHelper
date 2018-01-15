import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import sinon from 'sinon';
import isomorphicFetch from 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import inventory, {
  login,
  createNew,
  logout,
  fetchAllItems,
  addCoffee,
  updateCoffee,
  addBlend,
  updateBlend,
  addContainer,
  updateContainer,
  flagForDeletion,
  getCoffees,
  getBlends,
  getContainers } from '../../../src/client/reducers/inventory';

describe('inventory', () => {
  describe('actions', () => {

    function getFetchMockCallInfo(mockCall) {
      return {
        url: mockCall[0],
        tokenHeader: mockCall[1].headers['x-access-token'],
        body: mockCall[1].body
      };
    }

    beforeEach(() => {
      fetchMock.post('express:/v2/login', {token: 'myNewToken'});
      fetchMock.post('express:/v2/create', {token: 'myNewToken'});
      fetchMock.get('express:/inventory', {things: ['many things'], metadata: {lastSync: 'sync time', collectionName: 'my stuff'}});
      global.sessionStorage = {
        getItem: sinon.stub().withArgs('token').returns('tokenString'),
        setItem: sinon.spy(),
        clear: sinon.spy()
      };
    });

    afterEach(() => {
      fetchMock.restore();
    });

    describe('login', () => {
      it('clears errors, saves new token and fetches all inventory items', () => {
        const dispatchStub = sinon.stub();
        const expectedLoginBody = JSON.stringify({name: 'myName', password: 'aGoodPass!'});
        return login('myName', 'aGoodPass!')(dispatchStub)
          .then(() => {
            const loginPost = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const allDataGet = getFetchMockCallInfo(fetchMock.calls().matched[1]);
            const clearErrorAction = dispatchStub.args[0][0];
            const inventoryAction = dispatchStub.args[1][0];
            const metadataAction = dispatchStub.args[2][0];

            assert.strictEqual(loginPost.url, '/v2/login');
            assert.deepEqual(loginPost.body, expectedLoginBody);

            assert.strictEqual(allDataGet.url, '/inventory');
            assert.strictEqual(sessionStorage.setItem.args[0][0], 'token');
            assert.strictEqual(sessionStorage.setItem.args[0][1], 'myNewToken');
            assert.strictEqual(allDataGet.url, '/inventory');
            assert.strictEqual(allDataGet.tokenHeader, 'tokenString');
            assert.strictEqual(clearErrorAction.type, 'CLEAR_ERROR');
            assert.deepEqual(inventoryAction.payload.things, ['many things']);
            assert.deepEqual(inventoryAction.type, 'UPDATE_ALL_INVENTORY_ITEMS');
            assert.strictEqual(metadataAction.payload.lastSync, 'sync time');
            assert.strictEqual(metadataAction.payload.collectionName, 'my stuff');
            assert.deepEqual(metadataAction.type, 'UPDATE_METADATA');
          });
      });
    });

    describe('createNew', () => {
      it('clears errors, creates new inventory and saves token', () => {
        const dispatchStub = sinon.stub();
        const expectedCreateBody = JSON.stringify({newName: 'myName', newPassword: 'aGoodPass!'});
        return createNew('myName', 'aGoodPass!')(dispatchStub)
          .then(() => {
            const createNewPost = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const allDataGet = getFetchMockCallInfo(fetchMock.calls().matched[1]);
            const clearErrorAction = dispatchStub.args[0][0];
            const inventoryAction = dispatchStub.args[1][0];
            const metadataAction = dispatchStub.args[2][0];

            assert.strictEqual(createNewPost.url, '/v2/create');
            assert.deepEqual(createNewPost.body, expectedCreateBody);

            assert.strictEqual(allDataGet.url, '/inventory');
            assert.strictEqual(sessionStorage.setItem.args[0][0], 'token');
            assert.strictEqual(sessionStorage.setItem.args[0][1], 'myNewToken');
            assert.strictEqual(allDataGet.url, '/inventory');
            assert.strictEqual(allDataGet.tokenHeader, 'tokenString');
            assert.strictEqual(clearErrorAction.type, 'CLEAR_ERROR');
            assert.deepEqual(inventoryAction.payload.things, ['many things']);
            assert.deepEqual(inventoryAction.type, 'UPDATE_ALL_INVENTORY_ITEMS');
            assert.strictEqual(metadataAction.payload.lastSync, 'sync time');
            assert.strictEqual(metadataAction.payload.collectionName, 'my stuff');
            assert.deepEqual(metadataAction.type, 'UPDATE_METADATA');
          });
      });
    });

    describe('logout', () => {
      it('resets inventory items and removes token', () => {
        const result = logout();

        assert(sessionStorage.clear.calledOnce);
        assert.strictEqual(result.type, 'RESET_ALL_INVENTORY_ITEMS');
      });
    });

    describe('fetchAllItems', () => {
      it('fetches all inventory items', () => {
        const dispatchStub = sinon.stub();
        return fetchAllItems()(dispatchStub)
          .then(() => {
            const allDataGet = getFetchMockCallInfo(fetchMock.calls().matched[0]);
            const inventoryAction = dispatchStub.args[0][0];
            const metadataAction = dispatchStub.args[1][0];
            assert.strictEqual(allDataGet.url, '/inventory');
            assert.strictEqual(allDataGet.tokenHeader, 'tokenString');
            assert.deepEqual(inventoryAction.payload.things, ['many things']);
            assert.deepEqual(inventoryAction.type, 'UPDATE_ALL_INVENTORY_ITEMS');
            assert.strictEqual(metadataAction.payload.lastSync, 'sync time');
            assert.strictEqual(metadataAction.payload.collectionName, 'my stuff');
            assert.deepEqual(metadataAction.type, 'UPDATE_METADATA');
          });
      });
    });

    describe('updateCoffee', () => {
      it('returns an UPDATE_INVENTORY_ITEM action with coffee marked as dirty', () => {
        const coffee = {_id: 789, greenWeight: 10, roastedWeight: 11};
        const result = updateCoffee(coffee);

        assert.strictEqual(result.type, 'UPDATE_INVENTORY_ITEM');
        assert.deepEqual(result.payload, {_id: 789, greenWeight: 10, roastedWeight: 11, isDirty: true});
      });
    });

    describe('addCoffee', () => {
      it('returns an ADD_INVENTORY_ITEM action with default coffee marked as new', () => {
        const result = addCoffee();

        assert.strictEqual(result.type, 'ADD_INVENTORY_ITEM');
        const {_id, ...newCoffeeProps} = result.payload;
        assert.strictEqual(Guid.isGuid(_id), true);
        assert.deepEqual(newCoffeeProps, { category: 'coffee', name: 'New Coffee', origin: 'Origin', greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true });
      });
    });

    describe('updateBlend', () => {
      it('returns an UPDATE_INVENTORY_ITEM action with blend marked as dirty', () => {
        const coffee = {_id: 789, weight: 89};
        const result = updateBlend(coffee);

        assert.strictEqual(result.type, 'UPDATE_INVENTORY_ITEM');
        assert.deepEqual(result.payload, {_id: 789, weight: 89, isDirty: true});
      });
    });

    describe('addBlend', () => {
      it('returns an ADD_INVENTORY_ITEM action with default blend marked as new', () => {
        const result = addBlend();

        assert.strictEqual(result.type, 'ADD_INVENTORY_ITEM');
        const {_id, ...newBlendProps} = result.payload;
        assert.strictEqual(Guid.isGuid(_id), true);
        assert.deepEqual(newBlendProps, { category: 'blend',  name: 'Blend', origin: 'Origin', weight: 0, isNew: true });
      });
    });

    describe('updateContainer', () => {
      it('returns an UPDATE_INVENTORY_ITEM action with container marked as dirty', () => {
        const container = {_id: 56, weight: 78};
        const result = updateContainer(container);

        assert.strictEqual(result.type, 'UPDATE_INVENTORY_ITEM');
        assert.deepEqual(result.payload, {_id: 56, weight: 78, isDirty: true});
      });
    });

    describe('addContainer', () => {
      it('returns an ADD_INVENTORY_ITEM action with default container marked as new', () => {
        const result = addContainer();

        assert.strictEqual(result.type, 'ADD_INVENTORY_ITEM');
        const {_id, ...newContainerProps} = result.payload;
        assert.strictEqual(Guid.isGuid(_id), true);
        assert.deepEqual(newContainerProps, { name: 'New Container', category: 'container', weight: 0, isNew: true });
      });
    });

    describe('flagForDeletion', () => {
      it('returns an UPDATE_INVENTORY_ITEM action with item marked for deletion', () => {
        const id = 56;
        const result = flagForDeletion(id);

        assert.strictEqual(result.type, 'UPDATE_INVENTORY_ITEM');
        assert.deepEqual(result.payload, {_id: id, isDeleted: true});
      });
    });
  });

  describe('selectors', () => {
    describe('getCoffees', () => {
      it('returns all coffee items that are not deleted', () => {
        const coffeeItem = {_id: 89, category: 'coffee', things: 'stuff'};
        const otherItem = {_id: 78, category: 'potatoes', stuff: 'weird'};
        const deletedItem = {_id: 90, category: 'coffee', isDeleted: true};
        const state = {
          inventory: [ coffeeItem, otherItem, deletedItem ]
        };

        const result = getCoffees(state);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0], coffeeItem);
      });
    });

    describe('getBlends', () => {
      it('returns all blend items', () => {
        const otherItem = {_id: 90, category: 'potatoes', things: 'stuff'};
        const blendItem = {_id: 56, category: 'blend', stuff: 'weird'};
        const deletedItem = {_id: 90, category: 'blend', isDeleted: true};

        const state = {
          inventory: [ otherItem, blendItem, deletedItem ]
        };

        const result = getBlends(state);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0], blendItem);
      });
    });

    describe('getContainers', () => {
      it('returns all container items', () => {
        const otherItem = {_id: 90, category: 'potatoes', things: 'stuff'};
        const containerItem = {_id: 56, category: 'container', stuff: 'weird'};
        const deletedItem = {_id: 90, category: 'container', isDeleted: true};

        const state = {
          inventory: [ otherItem, containerItem, deletedItem ]
        };

        const result = getContainers(state);

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0], containerItem);
      });
    });
  });

  describe('reducer', () => {
    describe('UPDATE_ALL_INVENTORY_ITEMS', () => {
      it('updates all items and ignores metadata', () => {
        const oldInventoryItems = [{stuff: 'old'}]
        const action = {type: 'UPDATE_ALL_INVENTORY_ITEMS', payload: {
            coffees: [{category: 'coffee'}],
            blends: [{category: 'blend'}, {category: 'blend'}],
            containers: [{category: 'container'}],
            metadata: [{metadata: true}]
          }
        };

        const result = inventory(oldInventoryItems, action);

        assert.strictEqual(result.length, 4);
        assert(!result.find((item) => item.stuff === 'old'));
        assert(!result.find((item) => item.metadata));
      });
    });

    describe('ADD_INVENTORY_ITEM', () => {
      it('adds a coffee at the bottom of the list', () => {
        const oldCoffeeList = [
          {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21 }
        ];
        const newCoffee = {_id: 14, greenWeight: 777, roastedWeight: 5, totalWeight: 67, isNew: true };
        const action = {type: 'ADD_INVENTORY_ITEM', payload: newCoffee};

        const result = inventory(oldCoffeeList, action);

        assert.deepEqual(result[0], {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21});
        assert.deepEqual(result[1], {_id: 14, greenWeight: 777, roastedWeight: 5, totalWeight: 67, isNew: true });
      });
    });

    describe('UPDATE_INVENTORY_ITEM', () => {
      it('returns all coffees with matching coffees updated', () => {
        const oldCoffeeList = [
          {_id: 789, importantField: 'thing', greenWeight: 10, roastedWeight: 11, totalWeight: 21 },
          {_id: 999, importantField: 'ugh', greenWeight: 5, roastedWeight: 85, totalWeight: 90}
        ];
        const action = {type: 'UPDATE_INVENTORY_ITEM', payload: {_id: 789, greenWeight: 500, roastedWeight: 11, totalWeight: 511, isDirty: true}};

        const result = inventory(oldCoffeeList, action);
        assert.deepEqual(result[0], {_id: 789, importantField: 'thing', greenWeight: 500, roastedWeight: 11, totalWeight: 511, isDirty: true});
        assert.deepEqual(result[1], {_id: 999, importantField: 'ugh', greenWeight: 5, roastedWeight: 85, totalWeight: 90});
      });
    });

    describe('RESET_ALL_INVENTORY_ITEMS', () => {
      it('removes all inventory items', () => {
        const oldCoffeeList = [
          {_id: 789, importantField: 'thing', greenWeight: 10, roastedWeight: 11, totalWeight: 21 },
          {_id: 999, importantField: 'ugh', greenWeight: 5, roastedWeight: 85, totalWeight: 90}
        ];
        const action = {type: 'RESET_ALL_INVENTORY_ITEMS'};

        const result = inventory(oldCoffeeList, action);
        assert.strictEqual(result.length, 0);
      });
    });
  });
});
