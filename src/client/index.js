import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

render(
  <Provider store={() => {}}>
    <div />
  </Provider>,
  document.getElementById('main')
);
