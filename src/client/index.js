import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';

render(
  <Provider store={() => {}}>
    <App />
  </Provider>,
  document.getElementById('main')
);
