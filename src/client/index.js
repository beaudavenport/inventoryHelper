import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import Navbar from './Navbar';
import rootReducer from './reducers';

const bootstrappedData = JSON.parse(sessionStorage.getItem('payload'));
const preloadedState = {
  inventory: bootstrappedData.coffees,
  lastSync: bootstrappedData.lastSync
};

const store = createStore(
  rootReducer,
  preloadedState,
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

render(
  <Provider store={store}>
    <div>
      <Navbar />
      <App />
    </div>
  </Provider>,
  document.getElementById('main')
);
