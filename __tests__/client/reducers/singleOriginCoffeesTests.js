import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import singleOriginCoffees, { addCoffee, updateCoffee } from '../../../src/client/reducers/singleOriginCoffees';

describe('singleOriginCoffees', () => {
  describe('actions', () => {
    describe('updateCoffee', () => {
      it('returns an UPDATE_COFFEE action with coffee', () => {
        const coffee = {items: 'values'};
        assert.deepEqual(updateCoffee(coffee), {type: 'UPDATE_COFFEE', coffee: {items: 'values'}});
      });
    });

    describe('addCoffee', () => {
      it('returns an ADD_COFFEE action', () => {
        assert.deepEqual(addCoffee(), {type: 'ADD_COFFEE'});
      });
    });
  });

  describe('reducer', () => {
    describe('ADD_COFFEE', () => {
      it('adds a coffee with a new GUID at the top of the list', () => {
        const oldCoffeeList = [
          {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21 }
        ];
        const action = {type: 'ADD_COFFEE'};

        const result = singleOriginCoffees(oldCoffeeList, action);
        const {_id, ...newCoffeeProps} = result[0];
        assert.strictEqual(Guid.isGuid(_id), true);
        assert.deepEqual(newCoffeeProps, { greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true });
        assert.deepEqual(result[1], {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21});
      });
    });

    describe('UPDATE_COFFEE', () => {
      it('returns all coffees with matching coffees updated and totalWeight calculated', () => {
        const oldCoffeeList = [
          {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21 },
          {_id: 999, greenWeight: 5, roastedWeight: 85, totalWeight: 90}
        ];
        const action = {type: 'UPDATE_COFFEE', coffee: {_id: 789, greenWeight: 500}};

        const result = singleOriginCoffees(oldCoffeeList, action);
        assert.deepEqual(result[0], {_id: 789, greenWeight: 500, roastedWeight: 11, totalWeight: 511, isDirty: true});
        assert.deepEqual(result[1], {_id: 999, greenWeight: 5, roastedWeight: 85, totalWeight: 90});
      });
    });
  });
});
