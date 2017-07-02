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

export function deleteInventoryItem(id) {
  return fetch(`/inventory/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': sessionStorage.getItem('token')
    }
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

export function fetchAllData() {
  return fetch('/inventory', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': sessionStorage.getItem('token')
    }
  });
}

export function sendLogin(name, password) {
  return fetch('/v2/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: name, password: password})
  });
}

export function sendCreate(name, password) {
  return fetch('/v2/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({newName: name, newPassword: password})
  });
}
