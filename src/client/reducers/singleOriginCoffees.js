const UPDATE_COFFEE = 'UPDATE_COFFEE';

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
    case UPDATE_COFFEE:
      return state.map(coffee => {
          if (coffee._id === action.coffee._id) {
            const newCoffee = { ...coffee, ...action.coffee };
            return { ...newCoffee, totalWeight: calculateTotalWeight(newCoffee.greenWeight, newCoffee.roastedWeight) }
          } else {
            return coffee;
          }
      });
    default:
      return state;
  }
};
