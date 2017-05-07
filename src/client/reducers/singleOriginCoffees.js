import Guid from 'guid';

const ADD_COFFEE = 'ADD_COFFEE';
const UPDATE_COFFEE = 'UPDATE_COFFEE';

export function addCoffee() {
  return {
    type: ADD_COFFEE
  };
}

export function updateCoffee(coffee) {
  return {
    type: UPDATE_COFFEE,
    coffee
  };
}

function calculateTotalWeight(greenWeight, roastedWeight) {
  const greenWeightFloat = greenWeight ? parseFloat(greenWeight) : 0.00;
  const roastedWeightFloat = roastedWeight ? parseFloat(roastedWeight) : 0.00;
  return greenWeightFloat + roastedWeightFloat;
}

export default (state = [], action) => {
  switch(action.type) {
    case ADD_COFFEE:
      const newCoffee = { _id: Guid.raw(), greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true};
      return [newCoffee, ...state];

    case UPDATE_COFFEE:
      return state.map(coffee => {
          if (coffee._id === action.coffee._id) {
            const newCoffee = { ...coffee, ...action.coffee, isDirty: true };
            return { ...newCoffee, totalWeight: calculateTotalWeight(newCoffee.greenWeight, newCoffee.roastedWeight) }
          } else {
            return coffee;
          }
      });
    default:
      return state;
  }
};
