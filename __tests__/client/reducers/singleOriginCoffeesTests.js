import mocha from 'mocha';
import assert from 'assert';
import Guid from 'guid';
import singleOriginCoffees, { addCoffee, updateCoffee } from '../../../src/client/reducers/singleOriginCoffees';

describe('singleOriginCoffees', () => {
  describe('actions', () => {
    describe('updateCoffee', () => {
      it('returns an UPDATE_COFFEE action with coffee marked as dirty', () => {
        const coffee = {_id: 789, greenWeight: 10, roastedWeight: 11};
        const result = updateCoffee(coffee);

        assert.strictEqual(result.type, 'UPDATE_COFFEE');
        assert.deepEqual(result.payload, {_id: 789, greenWeight: 10, roastedWeight: 11, isDirty: true});
      });
    });

    describe('addCoffee', () => {
      it('returns an ADD_COFFEE action with default coffee marked as new', () => {
        const result = addCoffee();

        assert.strictEqual(result.type, 'ADD_COFFEE');
        const {_id, ...newCoffeeProps} = result.payload;
        assert.strictEqual(Guid.isGuid(_id), true);
        assert.deepEqual(newCoffeeProps, { category: 'coffee', greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true });
      });
    });
  });

  describe('reducer', () => {
    describe('ADD_COFFEE', () => {
      it('adds a coffee at the top of the list', () => {
        const oldCoffeeList = [
          {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21 }
        ];
        const newCoffee = {_id: 14, greenWeight: 777, roastedWeight: 5, totalWeight: 67, isNew: true };
        const action = {type: 'ADD_COFFEE', payload: newCoffee};

        const result = singleOriginCoffees(oldCoffeeList, action);

        assert.deepEqual(result[0], {_id: 14, greenWeight: 777, roastedWeight: 5, totalWeight: 67, isNew: true });
        assert.deepEqual(result[1], {_id: 789, greenWeight: 10, roastedWeight: 11, totalWeight: 21});
      });
    });

    describe('UPDATE_COFFEE', () => {
      it('returns all coffees with matching coffees updated', () => {
        const oldCoffeeList = [
          {_id: 789, importantField: 'thing', greenWeight: 10, roastedWeight: 11, totalWeight: 21 },
          {_id: 999, importantField: 'ugh', greenWeight: 5, roastedWeight: 85, totalWeight: 90}
        ];
        const action = {type: 'UPDATE_COFFEE', payload: {_id: 789, greenWeight: 500, roastedWeight: 11, totalWeight: 511, isDirty: true}};

        const result = singleOriginCoffees(oldCoffeeList, action);
        assert.deepEqual(result[0], {_id: 789, importantField: 'thing', greenWeight: 500, roastedWeight: 11, totalWeight: 511, isDirty: true});
        assert.deepEqual(result[1], {_id: 999, importantField: 'ugh', greenWeight: 5, roastedWeight: 85, totalWeight: 90});
      });
    });
  });
});
