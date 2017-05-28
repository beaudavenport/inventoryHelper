import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import ContainerPage from './ContainerPage';
import Navbar from './Navbar';
import rootReducer from './reducers';

const bootstrappedData = JSON.parse(sessionStorage.getItem('payload'));
const { coffees, blends, lastSync } = bootstrappedData;
const preloadedState = {
  inventory: [...coffees, ...blends],
  lastSync: lastSync
};

const store = createStore(
  rootReducer,
  preloadedState,
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

render(
  <Provider store={store}>
    <BrowserRouter basename="/v2/login" >
      <div>
        <Navbar />
        <Route exact path="/" component={App} />
        <Route exact path="/containers" component={ContainerPage} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('main')
);
