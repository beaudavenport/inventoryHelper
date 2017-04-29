import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import Navbar from './Navbar';
import coffees from './reducers';

const bootstrappedData = JSON.parse(sessionStorage.getItem('payload'));
const preloadedState = {
  singleOriginCoffees: bootstrappedData.coffees
};

const store = createStore(coffees, preloadedState);

render(
  <Provider store={store}>
    <div>
      <Navbar />
      <App />
    </div>
  </Provider>,
  document.getElementById('main')
);
