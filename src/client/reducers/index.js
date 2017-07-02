import { combineReducers } from 'redux';
import inventory from './inventory';
import metadata from './metadata';

export default combineReducers({
  inventory,
  metadata
});
