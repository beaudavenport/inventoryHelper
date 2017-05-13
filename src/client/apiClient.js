export function updateInventoryItem(inventoryItem) {
  return fetch(`/inventory/${inventoryItem._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': sessionStorage.getItem('token')
    },
    body: JSON.stringify(inventoryItem)
  });
}

export function addInventoryItem(inventoryItem) {
  return fetch('/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': sessionStorage.getItem('token')
    },
    body: JSON.stringify(inventoryItem)
  });
}

export function updateSync(syncItem) {
  return fetch(`/inventory/sync/${syncItem._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': sessionStorage.getItem('token')
    }
  });
}
