import { combineReducers } from 'redux';
import inventory from './inventory';
import metadata from './metadata';
import error from './error';

export default combineReducers({
  inventory,
  metadata,
  error
});
