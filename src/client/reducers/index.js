import { combineReducers } from 'redux';
import singleOriginCoffees from './singleOriginCoffees';
import lastSync from './lastSync';

export default combineReducers({
  singleOriginCoffees,
  lastSync
});
