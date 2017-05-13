import { addInventoryItem, updateInventoryItem, updateSync } from '../apiClient';

export function sync() {
  return (dispatch, getState) => {
    const { singleOriginCoffees, lastSync } = getState();
    const coffeesToUpdate = singleOriginCoffees.filter(coffee => coffee.isDirty && !coffee.isNew);
    const coffeesToAdd = singleOriginCoffees.filter(coffee => coffee.isNew);
    const coffeeAddRequests = coffeesToAdd.map(coffee => {
      const { _id, isDirty, isNew, ...coffeePayload } = coffee;
      return addInventoryItem(coffeePayload);
    });
    const coffeeUpdateRequests = coffeesToUpdate.map(coffee => {
      const { isDirty, ...coffeePayload } = coffee;
      return updateInventoryItem(coffeePayload);
    });

    return Promise.all([...coffeeAddRequests, ...coffeeUpdateRequests])
      .then(() => updateSync(lastSync))
      .then(rawResponse => rawResponse.json())
      .then(lastSync => {
        dispatch({type: 'SAVE_SUCCESSFUL', payload: lastSync});
      });
  };
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'SAVE_SUCCESSFUL':
      return { ...action.payload };
    default:
      return state;
  }
};
