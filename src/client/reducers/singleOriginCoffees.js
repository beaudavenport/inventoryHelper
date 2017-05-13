import Guid from 'guid';

const ADD_COFFEE = 'ADD_COFFEE';
const UPDATE_COFFEE = 'UPDATE_COFFEE';

export function addCoffee() {
  return {
    type: ADD_COFFEE,
    payload: { _id: Guid.raw(), category: 'coffee', greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true}
  };
}

export function updateCoffee(coffee) {
  return {
    type: UPDATE_COFFEE,
    payload: {...coffee, isDirty: true}
  };
}

export default (state = [], action) => {
  switch(action.type) {
    case ADD_COFFEE:
      return [action.payload, ...state];

    case UPDATE_COFFEE:
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
