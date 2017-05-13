import { addInventoryItem, updateInventoryItem, updateSync } from '../apiClient';

export function sync() {
  return (dispatch, getState) => {
    const { inventory, lastSync } = getState();
    const itemsToUpdate = inventory.filter(item => item.isDirty && !item.isNew);
    const itemsToAdd = inventory.filter(item => item.isNew);
    const itemAddRequests = itemsToAdd.map(item => {
      const { _id, isDirty, isNew, ...itemPayload } = item;
      return addInventoryItem(itemPayload);
    });
    const itemUpdateRequests = itemsToUpdate.map(item => {
      const { isDirty, ...itemPayload } = item;
      return updateInventoryItem(itemPayload);
    });

    return Promise.all([...itemAddRequests, ...itemUpdateRequests])
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