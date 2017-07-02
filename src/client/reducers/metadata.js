import { addInventoryItem,
         updateInventoryItem,
         deleteInventoryItem,
         updateSync } from '../apiClient';

export function sync() {
  return (dispatch, getState) => {
    const { inventory, metadata } = getState();
    const itemsToUpdate = inventory.filter(item => item.isDirty && !item.isNew);
    const itemsToAdd = inventory.filter(item => item.isNew);
    const itemsToDelete = inventory.filter(item => item.isDeleted);

    const itemAddRequests = itemsToAdd.map(item => {
      const { _id, isDirty, isNew, ...itemPayload } = item;
      return addInventoryItem(itemPayload);
    });
    const itemUpdateRequests = itemsToUpdate.map(item => {
      const { isDirty, ...itemPayload } = item;
      return updateInventoryItem(itemPayload);
    });
    const itemDeleteRequests = itemsToDelete.map(item => {
      return deleteInventoryItem(item._id);
    });

    return Promise.all([...itemAddRequests, ...itemUpdateRequests, ...itemDeleteRequests])
      .then(() => updateSync(metadata))
      .then(rawResponse => rawResponse.json())
      .then(metadata => {
        dispatch({type: 'UPDATE_METADATA', payload: metadata});
      });
  };
}

export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_METADATA':
      return { ...action.payload };

    case 'RESET_ALL_INVENTORY_ITEMS':
      return {};
      
    default:
      return state;
  }
};
