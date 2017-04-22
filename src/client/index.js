import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import Navbar from './Navbar';

render(
  <Provider store={() => {}}>
    <div>
      <Navbar />
      <App />
    </div>
  </Provider>,
  document.getElementById('main')
);
