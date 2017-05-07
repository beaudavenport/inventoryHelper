import { updateInventoryItem, updateSync } from '../apiClient';

export function sync() {
  return (dispatch, getState) => {
    const { singleOriginCoffees, lastSync } = getState();
    const coffeesToUpdate = singleOriginCoffees.filter(coffee => coffee.isDirty);
    const coffeeRequests = coffeesToUpdate.map(coffee => {
      const { isDirty, ...coffeePayload } = coffee;
      return updateInventoryItem(coffeePayload);
    });

    return Promise.all(coffeeRequests)
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
