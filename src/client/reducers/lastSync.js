export function sync() {
  return (dispatch, getState) => {
    const { singleOriginCoffees, lastSync } = getState();
    const coffeeRequests = singleOriginCoffees.map(coffee => {
      return fetch(`/inventory/${coffee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(coffee)
      });
    });
    return Promise.all(coffeeRequests)
      .then(() => {
        return fetch(`/inventory/sync/${lastSync._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
          }
        });
      })
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
