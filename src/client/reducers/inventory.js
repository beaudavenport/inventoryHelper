import Guid from 'guid';
import { fetchAllData, sendLogin, sendCreate } from '../apiClient';
import { setCredentials, clearCredentials }  from '../CredentialProvider';
import { addError, clearError } from './error';

const ADD_INVENTORY_ITEM = 'ADD_INVENTORY_ITEM';
const UPDATE_INVENTORY_ITEM = 'UPDATE_INVENTORY_ITEM';
const UPDATE_ALL_INVENTORY_ITEMS = 'UPDATE_ALL_INVENTORY_ITEMS';
const RESET_ALL_INVENTORY_ITEMS = 'RESET_ALL_INVENTORY_ITEMS';

export function login(name, password) {
  return ((dispatch) => {
    dispatch(clearError());
    return sendLogin(name, password)
      .then((rawResponse) => {
        return rawResponse.json()
          .then((result) => {
            if(!rawResponse.ok) {
              throw new Error(result.error);
            }
            setCredentials(result.token);
            return fetchAllItems()(dispatch);
          });
      })
      .catch(err => {
        dispatch(addError(err.message));
      });
  });
}

export function createNew(name, password) {
  return ((dispatch) => {
    dispatch(clearError());
    return sendCreate(name, password)
    .then((rawResponse) => {
      return rawResponse.json()
        .then((result) => {
          if(!rawResponse.ok) {
            throw new Error(result.error);
          }
          setCredentials(result.token);
          return fetchAllItems()(dispatch);
        });
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
  });
}

export function fetchAllItems() {
  return ((dispatch) => {
    return fetchAllData()
      .then((rawResponse) => rawResponse.json())
      .then((result) => {
        dispatch({ type: UPDATE_ALL_INVENTORY_ITEMS, payload: result });
        dispatch({ type: 'UPDATE_METADATA', payload: result.metadata });
      });
  });
}

export function logout() {
  clearCredentials();
  return { type: RESET_ALL_INVENTORY_ITEMS };
}

export function addCoffee() {
  return {
    type: ADD_INVENTORY_ITEM,
    payload: { _id: Guid.raw(), name: 'New Coffee', origin: 'Origin', category: 'coffee', greenWeight: 0, roastedWeight: 0, totalWeight: 0, isNew: true}
  };
}

export function updateCoffee(coffee) {
  return {
    type: UPDATE_INVENTORY_ITEM,
    payload: {...coffee, isDirty: true}
  };
}

export function addBlend() {
  return {
    type: ADD_INVENTORY_ITEM,
    payload: { _id: Guid.raw(), name: 'Blend', origin: 'Origin', category: 'blend', weight: 0, isNew: true}
  };
}

export function updateBlend(blend) {
  return {
    type: UPDATE_INVENTORY_ITEM,
    payload: {...blend, isDirty: true}
  };
}

export function addContainer() {
  return {
    type: ADD_INVENTORY_ITEM,
    payload: { _id: Guid.raw(), name: 'New Container', category: 'container', weight: 0, isNew: true}
  };
}

export function updateContainer(container) {
  return {
    type: UPDATE_INVENTORY_ITEM,
    payload: {...container, isDirty: true}
  };
}

export function flagForDeletion(id) {
  return {
    type: UPDATE_INVENTORY_ITEM,
    payload: {_id: id, isDeleted: true}
  };
}

export function getCoffees(state) {
  return state.inventory.filter(item => {
    return item.category === 'coffee' && !item.isDeleted;
  });
}

export function getBlends(state) {
  return state.inventory.filter(item => {
    return item.category === 'blend' && !item.isDeleted;
  });
}

export function getContainers(state) {
  return state.inventory.filter(item => {
    return item.category === 'container' && !item.isDeleted;
  });
}

export default (state = [], action) => {
  switch(action.type) {
    case UPDATE_ALL_INVENTORY_ITEMS:
      const { coffees, blends, containers } = action.payload;
      return [...coffees, ...blends, ...containers];

    case ADD_INVENTORY_ITEM:
      return [ ...state, action.payload];

    case UPDATE_INVENTORY_ITEM:
      return state.map(coffee => {
          if (coffee._id === action.payload._id) {
            return { ...coffee, ...action.payload }
          } else {
            return coffee;
          }
      });

    case RESET_ALL_INVENTORY_ITEMS:
      return [];

    default:
      return state;
  }
};
