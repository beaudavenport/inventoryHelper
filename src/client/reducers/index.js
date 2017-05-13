import { combineReducers } from 'redux';
import inventory from './inventory';
import lastSync from './lastSync';

export default combineReducers({
  inventory,
  lastSync
});
