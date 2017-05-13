import Guid from 'guid';

const ADD_INVENTORY_ITEM = 'ADD_INVENTORY_ITEM';
const UPDATE_INVENTORY_ITEM = 'UPDATE_INVENTORY_ITEM';

export function addCoffee() {
  return {
    type: ADD_INVENTORY_ITEM,
    payload: { _id: Guid.raw(), category: 'coffee', greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true}
  };
}

export function updateCoffee(coffee) {
  return {
    type: UPDATE_INVENTORY_ITEM,
    payload: {...coffee, isDirty: true}
  };
}

export function getCoffees(state) {
  return state.inventory.filter(item => {
    return item.category === 'coffee';
  });
}

export function getBlends(state) {
  return state.inventory.filter(item => {
    return item.category === 'blend';
  });
}

export default (state = [], action) => {
  switch(action.type) {
    case ADD_INVENTORY_ITEM:
      return [action.payload, ...state];

    case UPDATE_INVENTORY_ITEM:
      return state.map(coffee => {
          if (coffee._id === action.payload._id) {
            return { ...coffee, ...action.payload }
          } else {
            return coffee;
          }
      });
    default:
      return state;
  }
};
